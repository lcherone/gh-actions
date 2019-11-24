const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')
// const io = require('@actions/io')
const lxc = require('lxc-query')
const fs = require('fs')

const setupScript = {
  lxd: `
#!/bin/bash
export PATH=./node_modules/.bin:/usr/bin:/bin:/snap/bin:$PATH
set -eo pipefail
sudo apt-get -qy remove lxd lxd-client
sudo usermod -a -G lxd $USER
sudo apt-get -qy install snapd
sudo snap install lxd
sudo ln -s /snap/bin/lxc /usr/bin/lxc
sudo lxd waitready
sudo lxd init --auto --network-address="127.0.0.1" --storage-backend=dir
openssl genrsa 2048 > client.key
openssl req -new -x509 -nodes -sha1 -days 365 -key client.key -out client.crt -subj "/C=GB/ST=London/L=London/O=TEST/OU=IT Department/CN=lxd.localhost"
sudo lxd.lxc config trust add client.crt
curl -s -k -L --cert client.crt --key client.key "https://127.0.0.1:8443/1.0" 2>&1 /dev/null`
}

async function main() {
  try {

    // - process.env
    core.startGroup('Environment')
    console.log(process.env)
    core.endGroup()
    //
    // - github.context
    core.startGroup('Github context')
    console.log(github.context)
    core.endGroup()

    /**
     *
     */
    core.startGroup('Writing LXD setup script')
    fs.writeFileSync("/tmp/setupScript.lxd.sh", setupScript.lxd.trim() /*, { mode: 0o666 }*/ )
    core.endGroup()

    /**
     *
     */
    core.startGroup('Executing LXD setup script')
    await exec.exec('bash', ['/tmp/setupScript.lxd.sh'])
    core.endGroup()

    /**
     * LXD
     */
    let input = {
      remote: (function () {
        let remote = core.getInput('remote')
        if (remote !== '{}') {
          try {
            return JSON.parse(remote)
          } catch (_) {
            core.setFailed(`Error: Invalid JSON input: remote`)
          }
        }
        return {
          name: core.getInput('remote-name') || '',
          url: core.getInput('remote-url') || '',
          secret: core.getInput('remote-secret') || '',
          protocol: core.getInput('remote-protocol') || 'lxd',
          'auth-type': core.getInput('remote-auth-type') || 'tls'
        }
      })(),
      command: core.getInput('command'),
      script: core.getInput('script')
    }

    core.startGroup('inputs')
    console.log(input)
    core.endGroup()

    //
    let result

    //
    lxc.setCmd('sudo lxd.lxc')

    // add remote
    if (input.remote.name !== '' && input.remote.url !== '' && input.remote.secret !== '') {
      core.startGroup('adding remote to LXD server: ' + input.command)
      let remotes = await lxc.server.remotes()

      //
      if (!remotes.includes(input.remote.name)) {
        try {
          result = await lxc.local(
            `lxd.lxc remote add ${input.remote['name']} ${input.remote['url']} ` +
            `--accept-certificate ` +
            `--protocol=${input.remote['protocol']} ` +
            `--auth-type=${input.remote['auth-type']} ` +
            `--password=${input.remote['secret']}`, {}, false)
          core.info(result)
        } catch (err) {
          core.error(err)
        }
      } else {
        core.info('Skipping, remote already added')
      }
      core.endGroup()
    }

    //
    core.startGroup('local LXD server: lxc remote list')
    try {
      result = await lxc.local('lxd.lxc remote list', {}, false)
      core.info(result)
    } catch (err) {
      core.error(err)
    }
    core.endGroup()

    // script
    if (input.script !== '') {
      core.startGroup('executing scripted input')
      try {
        eval(`;(async () => { ${input.script} })()`)
      } catch (err) {
        core.error(err)
      }
      core.endGroup()
    }

    result = await lxc.containers.exec('', 'test-alpine', {
      "command": ["/bin/bash", "-c", "echo Hello from inside container"],
      "environment": {},
      "wait-for-websocket": false,
      "record-output": false,
      "interactive": false,
      "width": 80,
      "height": 25
    })

    // command
    if (input.command !== '') {
      core.startGroup('local LXD server: ' + input.command)
      try {
        result = await lxc.local(input.command, {}, false)
        core.info(result)
      } catch (err) {
        core.error(err)
      }
      core.endGroup()
    }

    // //
    // const script = core.getInput('script')

    // //
    // core.startGroup('local LXD server, run script')
    // result = await lxc.local(script)
    // console.log(result)
    // core.endGroup()

    // core.startGroup('local LXD server: lxc remote list: after')
    // result = await lxc.local('lxc remote list')
    // console.log(result)
    // core.endGroup()

    // //result = await lxc.query('local:/1.0', 'GET', {})
    // //console.log(result)

  } catch (error) {
    core.setFailed(error)
  }
}

main()
