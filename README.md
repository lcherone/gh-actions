# Github actions

WIP: Some Github actions, for various things.

### actions

- **gh-actions-foo** - not sure yet, is a boilerplate for something. Is nodejs script based, uses @actions/core, @actions/github, ncc
- **http-post** - will be an action which you can do a POST request to an endpoint, probably useless
- **lxd** - will be a ubuntu/LXD/nodejs environment for testing my lxc-query package

### environment actions

Docker based images with simple run command and common tasks

- **node-10-alpine** - uses node:10-alpine base docker image
- **node-lts-slim** - uses node:lts-slim base docker image
- **node-nvm-ubuntu** - \*will use base ubuntu image, nvm with version passed as environment var
- **node-nvm-alpine** - \*will use base alpine image, nvm with version passed as environment var

### example workflow

```
name: Test My Thing

on: [push]

jobs:
   test:
     runs-on: ubuntu-latest
     steps:
       - name: Test stage
         uses: lcherone/gh-actions/node-10-alpine@master@master
         env:
           NODE_ENV: production
           PKG_MANAGER: npm
         args: run test
```

May add PHP ones, when/if I work on PHP code again ;p a zephir one might be cool
