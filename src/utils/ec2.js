const AWS = require('aws-sdk')

const ec2 = new AWS.EC2()

const createAMI = (params) => {
    console.log(params)
    ec2.createImage(params, function(err, data) {
        if (err) {
            console.log(err, err.stack)
        } else {
            console.log(data)
            ec2.waitFor('imageAvailable', { ImageIds : [ data.ImageId ] }, (err, data) => {
                if (err) {
                    console.log(err, err.stack)
                } else {
                    console.log(data)
                    console.log('Successfully created AMI Image: ' + params.Name)
                }
            })
        }  
    })
}

module.exports = {
    createAMI
}