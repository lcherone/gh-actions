#!/bin/bash

# debug
echo >&2 "Entrypoint: [ENV]"
echo >&2 "$(printenv)"

echo ::set-output name=stdout::$(curl $INPUT_COMMAND)
