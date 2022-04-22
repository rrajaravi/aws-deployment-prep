const yargs = require('yargs')

const awsFunction = require('./src/aws-functions')


yargs
    .command('create-ami', 'create both api and worker image', {
        'description': {
            alias: '-d'
        }
    }, (argv) => {
        awsFunction.loadConfig(argv)
        awsFunction.createAMI() 
    })
    .command('create-api-ami', 'create ami of api server', {
        'description': {
            alias: '-d'
        }
    }, (argv) => {
        awsFunction.loadConfig(argv)
        awsFunction.createApiAMI() 
    })
    .command('create-worker-ami', 'create ami of worker server', {
        'description': {
            alias: '-d'
        }
    }, (argv) => {
        awsFunction.loadConfig(argv)
        awsFunction.createWorkerAMI() 
    })
    .command('create-db-snapshot', 'create snapshot of database',
    (argv) => {
        awsFunction.loadConfig(argv.argv)
        awsFunction.createDbSnapshot()
    })
    .command('create-api-launch-config', 'create api launch config', {
        ami : {
            demand: true,
            type: 'string'
        }
    },
    (argv) => {
        awsFunction.loadConfig(argv)
        awsFunction.createApiLaunchConfig()
    })
    .command('create-worker-launch-config', 'create worker launch config', {
        ami : {
            demand: true,
            type: 'string'
        }
    },
    (argv) => {
        awsFunction.loadConfig(argv)
        awsFunction.createWorkerLaunchConfig()
    })
    .option('env', {
        alias: 'e',
        demand: true,
        })
    .option('date', {
    })
    .demandCommand(1, 1, 'You need to run one command', 'You cannot run more than one command at a time')
    .strict()
    .argv
