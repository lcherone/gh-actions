#!/bin/bash

# debug
echo "$1"

# set up environment
export NODE_ENV=${NODE_ENV:-"production"}
export PKG_MANAGER=${PKG_MANAGER:-"npm"}

# include functions
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
source "$DIR/functions.sh"

case $1 in
  #
  run)
    echo ::set-output name=stdout::$(runScript "$2")
    ;;

  #
  test)
    echo ::set-output name=stdout::$(runScript "test")
    ;;

  #
  build)
    echo ::set-output name=stdout::$(runScript "build")
    ;;

  # #
  # gh-pages)
  #   ghActionsSetup
  #   ghPages
  #   ;;

  *)
    help;;
esac