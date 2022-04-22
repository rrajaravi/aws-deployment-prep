const AWS = require('aws-sdk')

const rds = new AWS.RDS()

const createDBSnapshot = (params) => {
    rds.createDBSnapshot(params, (err, data) => {
        if (err) {
            console.log(err, err.stack)
        } else {
            console.log(data)
            rds.waitFor('dBSnapshotAvailable', { DBSnapshotIdentifier : data.DBSnapshot.DBSnapshotIdentifier }, (err, data) => {
                if (err) {
                    console.log(err, err.stack)
                } else {
                    console.log(data)
                    console.log('Successfully created DB Snapshot: ' + data.DBSnapshots.DBSnapshotIdentifier)
                }
            })
        }   
      })
    console.log(params)
}

module.exports = {
    createDBSnapshot
}