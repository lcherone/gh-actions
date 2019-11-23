#!/bin/bash

# debug
echo >&2 "Entrypoint: [ENV]"
echo >&2 "$(printenv)"

# Split input command into an array
IFS=' ' read -r -a command <<< "$INPUT_COMMAND"

# set up environment
export NODE_ENV=${NODE_ENV:-"production"}
export PKG_MANAGER=${PKG_MANAGER:-"npm"}

# include functions
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
source "$DIR/functions.sh"

#
case ${command[0]} in
  #
  run)
    echo >&2 "Running command: ${command[1]}"
    runCommand "${command[1]}"
    #echo ::set-output name=stdout::$()
    ;;

  #
  test)
    echo ::set-output name=stdout::$(runCommand "test")
    ;;

  #
  build)
    echo ::set-output name=stdout::$(runCommand "build")
    ;;

  *)
    help;;
esac
