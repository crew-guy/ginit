const CLI = require('clui')
const Configstore = require('configstore')
const Octokit = require('@octokit/rest')
const Spinner = CLI.Spinner
const { createBasicAuth } = require('@octokit/auth-basic')
const inquire = require('./inquire')
const pkg = require('../package.json')
const conf = new Configstore(pkg.name)

let oktokit

module.exports = {
    getInstance: () =>
    {
        return oktokit
    },
    getStoredToken: () =>
    {
        return conf.get('github.token')
    },
    getPersonalAccessToken:async () =>
    {
        const credentials = await inquire.askGithubCredentials()
        const status = new Spinner('ho raha tu authenticate....')
        status.start()

        const auth = createBasicAuth({
            username: credentials.username,
            password: credentials.password,
            on2Fa:async () =>
            {
                status.stop()
                const twoAuthToken = await inquire.getTwoFactorAuthToken()
                status.start()
                console.log(twoAuthToken)
                return twoAuthToken['Two Factor Authentication']
                // console.log('some 2fa logic applied')
            },
            token: {
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note:'ginit, a cli tool to manage gh repos'
            }
        })
        try
        {
            const res = await auth()
            if (res.token)
            {
                conf.set('github.token', res.token)
                return res.token
            } else
            {
                return 'GitHub token was not found. Please try again....'
            }
        }
        finally
        {
            status.stop()
        }
    },
    githubAuth: (token) => {
        octokit = new Octokit({
          auth: token
        });
      },
}
