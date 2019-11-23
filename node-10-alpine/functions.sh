#
function help {
  echo "The following commands exist:"
  echo ""
  echo "  - run <script>"
  echo "      execute the specified <script> on the package"
  echo "  - test"
  echo "      execute the test script"
  echo "  - build"
  echo "      execute the build script"
  echo ""
}

# This function will process the provided script with either
# NPM or Yarn
#   usage: runCommand [npm|yarn] <script>
function runCommand {
  script="$1"

  if [[ "$PKG_MANAGER" =~ ^[Yy]arn$ ]]; then
    $PKG_MANAGER="yarn"
  fi

  if [[ -z "$script" ]]; then
    echo "[ERROR] No script provided to execute"
    exit 1
  fi

  case $PKG_MANAGER in
    yarn)
      echo "Running: yarn $script"
      npm install yarn -g > /dev/null 2>&1
      yarn install > /dev/null 2>&1
      yarn $script
      ;;

    *)
      echo "Running: npm run $script"
      npm install > /dev/null 2>&1
      npm run $script
      ;;
  esac
}
