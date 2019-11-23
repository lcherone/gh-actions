#
function help {
  echo >&2 "The following commands exist:"
  echo >&2 ""
  echo >&2 "  - run <script>"
  echo >&2 "      execute the specified <script> on the package"
  echo >&2 "  - test"
  echo >&2 "      execute the test script"
  echo >&2 "  - build"
  echo >&2 "      execute the build script"
  echo >&2 ""
}

# This function will process the provided script with either
# NPM or Yarn
#   usage: runCommand [npm|yarn] <script>
function runCommand {
  echo >&2 "runCommand script: $1" 
  script="$1"

  if [[ "$PKG_MANAGER" =~ ^[Yy]arn$ ]]; then
    $PKG_MANAGER="yarn"
  fi

  if [[ -z "$script" ]]; then
    echo >&2 "[ERROR] No script provided to execute"
    exit 1
  fi

  case $PKG_MANAGER in
    yarn)
      echo >&2 "Running: yarn $script"
      npm install yarn -g #> /dev/null 2>&1
      yarn install > /dev/null 2>&1
      echo ::set-output name=stdout::$(yarn $script)
      ;;

    *)
      echo >&2 "Running: npm run $script"
      npm install > /dev/null 2>&1
      echo ::set-output name=stdout::$(npm run $script)
      ;;
  esac
}
