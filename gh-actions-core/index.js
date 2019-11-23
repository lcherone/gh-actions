/* see: https://github.com/actions/toolkit */
const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')
const io = require('@actions/io')

async function main() {
  try {
    /**
     * @actions/core examples
     */
    core.debug('Inside try block');

    // Manually wrap output's
    // - process.env
    core.startGroup('Environment')
    console.log(process.env)
    core.endGroup()
    // - github.context
    core.startGroup('Github context')
    console.log(github.context)
    core.endGroup()

    // Manually wrap output's
    await core.group('Do something async', async () => {
      console.log('noice!')
      return Promise.resolve()
    })

    /**
     * @actions/github examples
     */
    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // myToken: ${{ secrets.GITHUB_TOKEN }}
    // https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret
    /*
    const myToken = core.getInput('myToken');

    //const octokit = new github.GitHub(myToken);
    octokit.log.info('Octokit woop!')
    */

    /**
     * @actions/exec example
     * @actions/io example
     */
    await exec.exec('pwd')

    core.startGroup('ls ./')
    await exec.exec('ls', ['-la'], {
      cwd: './'
    })
    core.endGroup()

    //
    const npmPath = await io.which('npm', true)

    // npm install
    await exec.exec(`"${npmPath}"`, ['install'], {
      cwd: './test-setup-node'
    })

    // npm run test
    await exec.exec(`"${npmPath}"`, ['run', 'test'], {
      cwd: './test-setup-node'
    })

  } catch (error) {
    core.error(`Error: ${error.message}`);
    core.setFailed(error.message)
  }
}

main()