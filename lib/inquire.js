const inquirer = require('inquirer')
const files = require('./files')

module.exports = {
    askGithubCredentials: () =>
    {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: "Please enter your username",
                validate: (value) =>
                {
                    if (!value.length)
                    {
                        return 'Please enter a valid username or email address'
                    } else
                    {
                        return true
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Please enter a password',
                validate: (value) =>
                {
                    if (!value.length)
                    {
                        return 'Please enter a password'
                    } else
                    {
                        return true
                    }
                }
            }
        ]
        return inquirer.prompt(questions)
    },
    getTwoFactorAuthToken: () =>
    {
        return inquirer.prompt({
            name: 'Two Factor Authentication',
            type: 'input',
            message: "Please enter your 2 factor auth token",
            validate: (value) =>
            {
                if (value)
                {
                    return true
                } else
                {
                    throw new Error('2 factor auth token was incorrect. Please try again')
                }
            }
        })
    },
    askRepoDetails:()=> {
        const argv = require('minimist').process.argv.slice(2)
        const questions = [{
            name: 'name',
            type: 'input',
            default: argv._[0] || files.getCurrentDirectoryBase,
            validate: function( value ) {
                if (value.length) {
                  return true;
                } else {
                  return 'Please enter a name for the repository.';
                }
              }
        },
        {
            type: 'input',
            name: 'description',
            default: argv._[1] || null,
            message: 'Optionally enter a description of the repository:'
        },
        {
            type: 'list',
            name: 'visibility',
            message: 'Public or private:',
            choices: [ 'public', 'private' ],
            default: 'public'
        }]
    },
}