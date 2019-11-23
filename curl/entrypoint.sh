#!/bin/sh

set -e

# debug
echo >&2 "Entrypoint: [ENV]"
echo >&2 "$(printenv)"

echo >&2 "Executing: curl $INPUT_ARGS"

sh -c "/usr/bin/curl $*"

/usr/bin/curl $INPUT_ARGS

#echo "::set-output name=stdout::$output"
