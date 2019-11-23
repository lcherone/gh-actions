const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    console.log('env', process.env)
    console.log('github', github.context)
    console.log('process.env.foo', process.env.foo)
    console.log('process.env.foo.length', process.env.foo.length)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
