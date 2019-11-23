const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    console.log('process.env', process.env)
    console.log('github.context', github.context)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()