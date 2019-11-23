#!/bin/sh

# debug
echo >&2 "Entrypoint: [ENV]"
echo >&2 "$(printenv)"

echo >&2 "Executing: curl -s $INPUT_ARGS"

output=$(curl -s $INPUT_ARGS)

echo ::set-output name=stdout::"$output"
