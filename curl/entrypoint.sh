#!/bin/bash

# debug
echo >&2 "Args: $@"
echo >&2 "Entrypoint: [ENV]"
echo >&2 "$(printenv)"
echo >&2 "$INPUT_COMMAND"

echo ::set-output name=stdout::$($INPUT_COMMAND)
