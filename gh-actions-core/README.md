# Github action - gh-actions-core

Nodejs scripted action using, `@actions/core`, `@actions/github` and `@zeit/ncc`.

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
      uses: lcherone/gh-actions/gh-actions-core@master
```
