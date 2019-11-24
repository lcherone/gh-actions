const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')
const io = require('@actions/io')
const lxc = require('lxc-query')
const fs = require('fs')

const setupScript = {
  lxd: `
#!/bin/bash
export PATH=./node_modules/.bin:/usr/bin:/bin:/snap/bin:$PATH
set -eo pipefail
sudo apt-get -y remove lxd lxd-client
sudo usermod -a -G lxd $USER
sudo apt-get --yes install snapd
sudo snap install lxd
sudo ln -s /snap/bin/lxc /usr/bin/lxc
sudo lxd waitready
sudo lxd init --auto --network-address="127.0.0.1" --storage-backend=dir #--trust-password=$LXD_SECRET
openssl genrsa 2048 > client.key
openssl req -new -x509 -nodes -sha1 -days 365 -key client.key -out client.crt -subj "/C=GB/ST=London/L=London/O=TEST/OU=IT Department/CN=lxd.localhost"
sudo lxd.lxc config trust add client.crt
curl -s -k -L --cert client.crt --key client.key "https://127.0.0.1:8443/1.0"`
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
            core.setFailed(`Error: Invalid JSON input: remove`)
          }
        }
        return {
          name: core.getInput('remote-name') || '',
          url: core.getInput('remote-url') || '',
          secret: core.getInput('remote-secret') || '',
          protocol: core.getInput('remote-protocol') || 'lxd',
          authType: core.getInput('remote-auth-type') || 'tls'
        }
      })(),
      command: core.getInput('command')
    }

    core.startGroup('inputs')
    console.log(input)
    core.endGroup()

    let result

    //
    lxc.setCmd('sudo lxd.lxc')

    // add remote
    if (input.remote.name !== '' && input.remote.url !== '' && input.remote.secret !== '') {
      core.startGroup('adding remote to LXD server: ' + input.command)
      let remotes = await lxc.server.remotes()
      //
      if (!remotes.incudes(input.remote.name)) {
        try {
          result = await lxc.local(
            `lxc remote add ${input.remote.name} ${input.remote.url} ` +
            `--accept-certificate ` +
            `--protocol=${input.remote.protocol} ` +
            `--auth-type=${input.remote.authType} ` +
            `--password=${input.remote.secret}`, {}, false)
          core.info(result)
        } catch (err) {
          core.error(err)
        }
      } else {
        core.info('Skipping, remote already added')
      }
      core.endGroup()
    }

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
    core.error(`Error: ${JSON.stringify(error)}`)
    core.setFailed(error)
  }
}

main()
