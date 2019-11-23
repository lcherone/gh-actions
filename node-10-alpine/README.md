# Github action - node-10-alpine

Uses: `node-10-alpine` docker image.

### Example

```
name: CI

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    name: Run script and get output
    steps:
    - name: Checkout
      uses: actions/checkout@v1

    - name: Run unit tests on github
      id: test
      uses: lcherone/gh-actions/node-10-alpine@master
      env:
       NODE_ENV: development
       PKG_MANAGER: npm
      with:
        command: 'run test'

    - name: Get the output
      run: echo "${{ steps.test.outputs.stdout }}"
```
