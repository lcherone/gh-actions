const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')
const io = require('@actions/io')
const lxc = require('lxc-query')
const fs = require('fs')

const setupScript = {
  lxd: `
#!/bin/bash
echo >&2 "$(printenv)"
export PATH=./node_modules/.bin:/usr/bin:/bin:/snap/bin:$PATH
set -eo pipefail
sudo apt-get -y remove lxd lxd-client
sudo usermod -a -G lxd $USER
sudo apt-get --yes install snapd
sudo snap install lxd
sudo ln -s /snap/bin/lxc /usr/bin/lxc
sudo lxd waitready
sudo lxd init --auto --network-address="127.0.0.1" --storage-backend=dir --trust-password=$LXD_SECRET
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

    //
    lxc.setCmd('sudo lxd.lxc')

    //
    const script = core.getInput('script')

    //
    let result = await lxc.local(script)
    console.log(result)

    //result = await lxc.query('local:/1.0', 'GET', {})
    //console.log(result)

    /**
     * Add the remote
     * @todo will need to define and get input
     * would somewhat be like
     * [
                'lxc remote add',
                escapeshellarg($this->body['name']),
                escapeshellarg($this->body['url']),
                '--accept-certificate',
                (!empty($this->body['secret']) ? '--password='.escapeshellarg($this->body['secret']) : '--public'),
                '--protocol='.escapeshellarg($this->body['protocol']),
                '--auth-type='.escapeshellarg($this->body['auth_type']),
            ].join(' ')
     */


    //
    // const npmPath = await io.which('npm', true)

    // //
    // core.startGroup('npm install')
    // await exec.exec(`"${npmPath}"`, ['install'])
    // core.endGroup()

    // //
    // core.startGroup('npm run test')
    // await exec.exec(`"${npmPath}"`, ['run', 'test'])
    // core.endGroup()


  } catch (error) {
    core.error(`Error: ${error.message}`)
    core.setFailed(error.message)
  }
}

main()
