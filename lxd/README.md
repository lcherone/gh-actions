# Github action - LXD

Do deployment actions on LXD servers

### Example

```
name: CI

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    name: My workflow
    steps:
    - name: Checkout
      uses: actions/checkout@v1

    - name: Do something
      uses: lcherone/gh-actions/gh-actions-lxd@master
```
