#!/bin/sh

# debug
echo >&2 "Entrypoint: [ENV]"
echo >&2 "$(printenv)"

echo >&2 "curl $INPUT_ARGS"
curl $INPUT_ARGS

echo ::set-output name=stdout::"foo bar baz"
