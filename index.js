#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear')
const figlet = require('figlet')
const files = require('./lib/files')
const inquire = require('./lib/inquire')
const github = require('./lib/github')

clear()

console.log(
    chalk.yellow(
        figlet.textSync('Ginit',{horizontalLayout:"full"})
    )
)

if (files.directoryExists('.git'))
{
    console.log(chalk.red('Already a git repo !'))
    process.exit()
}

const run = async () =>{
    try {
    let token = await github.getStoredToken()
    if (!token)
    {
        token = await github.getPersonalAccessToken() 
    }
    console.log(token)
    github.githubAuth(token);

    // Create remote repository
    const url = await repo.createRemoteRepo();

    // Create .gitignore file
    await repo.createGitignore();

    // Set up local repository and push to remote
    await repo.setupRepo(url);

    console.log(chalk.green('All done!'));
    } catch(err) {
        if (err) {
            switch (err.status) {
            case 401:
                console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
                break;
            case 422:
                console.log(chalk.red('There is already a remote repository or token with the same name'));
                break;
            default:
                console.log(chalk.red(err));
            }
        }
    }
};
run()