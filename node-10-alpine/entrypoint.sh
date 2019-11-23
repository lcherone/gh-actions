#!/bin/bash

# set up environment
export NODE_ENV=${NODE_ENV:-"production"}
export PKG_MANAGER=${PKG_MANAGER:-"npm"}

# include functions
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
source "$DIR/functions.sh"

case $1 in
  #
  run)
    runScript "$2"
    ;;

  #
  test)
    runScript "test"
    ;;

  #
  build)
    runScript "build"
    ;;

  # #
  # gh-pages)
  #   ghActionsSetup
  #   ghPages
  #   ;;

  *)
    help;;
esac
