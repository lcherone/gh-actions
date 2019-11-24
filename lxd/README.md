# Github action - LXD

Do deployment actions on your LXD servers using [lxc-query](https://github.com/lcherone/lxc-query).

## Secrets

These secrets are used to add the LXD `remote` to the local LXD instance which is running in the action.

### `LXD_REMOTE_NAME`

Target LXD remote name. (e.g: MyServer)

### `LXD_REMOTE_URL`

Target LXD remote url. (e.g: https://IP:8443)

### `LXD_REMOTE_SECRET`

Target LXD remote secret. (e.g: my-really-secure-secret, set via `lxc config set core.trust_password my-really-secure-secret`)

See how they are used below, add more if required for your script or command.

## Inputs

### `remote`

Target LXD remote config in simple JSON format.

```yml
- name: My LXD action
  uses: lcherone/gh-actions/lxd@master
  with:
    remote: |
      {
        "name": "${{ secrets.LXD_REMOTE_NAME }}",
        "url": "${{ secrets.LXD_REMOTE_URL }}",
        "secret": "${{ secrets.LXD_REMOTE_SECRET }}",
        "protocol": "lxd",
        "auth-type": "tls"
      }
```

### or like `remote-*`

Target LXD remote as individual params.

```yml
- name: My LXD action
  uses: lcherone/gh-actions/lxd@master
  with:
    remote-name: ${{ secrets.LXD_REMOTE_NAME }}
    remote-url: ${{ secrets.LXD_REMOTE_URL }}
    remote-secret: ${{ secrets.LXD_REMOTE_SECRET }}
    remote-protocol: lxd
    remote-auth-type: tls"
```

### `command`

Run a command.

```yml
 - name: My LXD action
   uses: lcherone/gh-actions/lxd@master
   with:
    command: lxc list ${{ secrets.LXD_REMOTE_NAME }}:
```

### `script`

Script it using lxc-query, see docs for further details https://lcherone.github.io/lxc-query/server/#info.

```yml
- name: My LXD action
  uses: lcherone/gh-actions/lxd@master
  with:
    script: |
      result = await lxc.info(input.remote.name)
```

## Outputs

None yet, looking into it.

### Example

```
name: CI

on: [push]

jobs:
  test-setup-node:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@master

      - name: Test LXD action
        uses: lcherone/gh-actions/lxd@master
        with:
          # set remote
          remote: |
            {
              "name": "${{ secrets.LXD_REMOTE_NAME }}",
              "url": "${{ secrets.LXD_REMOTE_URL }}",
              "secret": "${{ secrets.LXD_REMOTE_SECRET }}",
              "protocol": "lxd",
              "auth-type": "tls"
            }
          # or like
          # remote-name: "${{ secrets.LXD_REMOTE_NAME }}"
          # remote-url: "${{ secrets.LXD_REMOTE_URL }}"
          # remote-secret: "${{ secrets.LXD_REMOTE_SECRET }}"
          # remote-protocol: "lxd"
          # remote-auth-type: "tls"

          # define a script, which is executed on the worker post LXD setup
          script: |
            //
            core.info('Executing script from workfow')

            //
            core.info('exec inside remote container')
            await lxc.containers.exec(input.remote['name'], 'my-container', {
              "command": ["/bin/sh", "-c", "echo Hello from inside container on remote server"],
              "environment": {
                HOME: '/root',
                TERM: 'xterm',
                USER: 'root'
              },
              "wait-for-websocket": false,
              "record-output": true,
              "interactive": false,
              "width": 80,
              "height": 25
            })

            //
            core.info('fetching container logs from remote')
            let logs = await lxc.containers.logs.list(input.remote['name'], 'my-container')
            for (let i in logs) {
              let logfile = logs[i].split(/[\\/]/).pop()

              if (logfile.indexOf('exec_') === -1) {
                core.info('skipping log: ' + logfile)
                continue
              }

              core.info('fetching log: ' + logfile)
              result += await lxc.containers.logs.get(input.remote['name'], 'my-container', logfile)

              core.info('deleting log from remote: ' + logfile)
              await lxc.containers.logs.delete(input.remote['name'], 'my-container', logfile)
            }

          command: lxc list ${{ secrets.LXD_REMOTE_NAME }}:

```
