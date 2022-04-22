const AWS = require('aws-sdk')

const autoscaling = new AWS.AutoScaling()

const createLaunchConfig = (params) => {
    console.log(params)
    autoscaling.createLaunchConfiguration(params, (err, data) => {
        if (err) {
            console.log(err, err.stack)
        }
        else {
            console.log(data)
            console.log('Successfully created launch configuration.')
        }
    })
}

module.exports = {
    createLaunchConfig
}