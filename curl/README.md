# Github action - curl

Uses: `alpine:latest` docker image.

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

    - name: Execute curl command
      id: test
      uses: lcherone/gh-actions/curl@master
      with:
        command: '-X POST "https://httpbin.org/post" -H "accept: application/json"'

    - name: Get the output
      run: echo "${{ steps.test.outputs.stdout }}"
```
