#!/bin/sh

# debug
echo >&2 "Entrypoint: [ENV]"
echo >&2 "$(printenv)"

echo >&2 "Executing: curl $INPUT_ARGS"

output=$(curl $INPUT_ARGS 2>/dev/null)

echo ::set-output name=stdout::"$output"
