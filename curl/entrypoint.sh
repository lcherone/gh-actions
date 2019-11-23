#!/bin/sh

# debug
echo >&2 "Entrypoint: [ENV]"
echo >&2 "$(printenv)"

curl $INPUT_ARGS

echo ::set-output name=stdout::"foo bar baz"
