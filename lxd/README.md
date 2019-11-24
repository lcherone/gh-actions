# Github action - LXD

WIP: Do deployment actions on LXD servers.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

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
        env:
          LXD_SECRET: testing
        with:
          remote-name: ''
          remote-url: ''
          remote-secret: ''
          container-name: ''
          container-action: ''
          script: ''
#
```
