#!/bin/sh

set -e

# debug
echo >&2 "Entrypoint: [ENV]"
echo >&2 "$(printenv)"
echo >&2 "Executing: curl -s $*"

echo >&2 "::set-output name=stdout::$(sh -c "/usr/bin/curl -s $*")"
