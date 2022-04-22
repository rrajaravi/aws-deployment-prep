const fs = require('fs')
const AWS = require('aws-sdk')
const dotenv = require('dotenv')
const { createAMI } = require('./utils/ec2')
const { createDBSnapshot } = require('./utils/rds')
const { createLaunchConfig } = require('./utils/autoscaling')
const path = require('path')

class Environment {

    loadConfig(argv) {
        this.argv = argv
        let ENV_FILE = path.join(path.resolve(__dirname, '..'), '/config/env.' + argv.env)
        if (!fs.existsSync(ENV_FILE)) {
            throw new Error('Unable to load config file: ' + ENV_FILE)
        }
        dotenv.config({path: ENV_FILE})
        this.name = process.env.Env
        this.apiInstance = process.env.API_INSTANCE
        this.workerInstance = process.env.WORKER_INSTANCE
        this.dbInstance = process.env.DB_INSTANCE
        this.dbSnapShotPrefix = process.env.DB_SNAPSHOT_PREFIX
        this.description = argv.description || ''
        this.dateStamp = argv.date || this.dateStamp
        this.amiID = argv.ami
        this.workerInstanceType = process.env.WORKER_INSTANCE_TYPE
        this.securityGroup = process.env.SECURITY_GROUP
        this.apiInstanceType = process.env.API_INSTANCE_TYPE
        this.keyName = process.env.KEY_NAME
    }
}

class AWSFunctions extends Environment {

    constructor() {
        super()
        let today = new Date()
        this.dateStamp = today.getDate() + '-' + today.toLocaleString('en-US', {month: 'short'}).toLowerCase() + '-' + today.getFullYear()
    }

    createAMI() {
        createAMI(this.getApiImageParams())
        createAMI(this.getWorkerImageParams())
    }

    createWorkerAMI() {
        createAMI(this.getWorkerImageParams())
    }

    createApiAMI() {
        createAMI(this.getApiImageParams())
    }

    createDbSnapshot() {
        createDBSnapshot(this.getDbSnapshotParams())
    }

    createApiLaunchConfig() {
        createLaunchConfig(this.getApiLaunchConfigParams())
    }

    createWorkerLaunchConfig() {
        createLaunchConfig(this.getWorkerLaunchConfigParams())
    }

    getApiImageParams() {
        return {
            InstanceId: this.apiInstance,
            Name: this.name + '-api-' + this.dateStamp,
            Description: this.description
        }
    }

    getWorkerImageParams() {
        return {
            InstanceId: this.workerInstance,
            Name: this.name + '-worker-' + this.dateStamp,
            Description: this.description
        }
    }

    getDbSnapshotParams() {
        return {
            DBInstanceIdentifier: this.dbInstance,
            DBSnapshotIdentifier: this.dbSnapShotPrefix + '-' + this.dateStamp
        }
    }

    getApiLaunchConfigParams() {
        return {
            ImageId: this.amiID, 
            InstanceType: this.apiInstanceType, 
            LaunchConfigurationName: this.name + '-api-' + this.dateStamp,
            EbsOptimized: true,
            KeyName: this.keyName,
            InstanceMonitoring: {
                Enabled: true
            },
            SecurityGroups: [
               this.securityGroup
            ]
        }
    }

    getWorkerLaunchConfigParams() {
        return {
            ImageId: this.amiID, 
            InstanceType: this.workerInstanceType, 
            LaunchConfigurationName: this.name + '-worker-' + this.dateStamp,
            BlockDeviceMappings: [
                {
                  DeviceName: '/dev/sda1',
                  Ebs: {
                    DeleteOnTermination: true,
                    Encrypted: false,
                    Iops: 240,
                    SnapshotId: 'snap-0a0d8fa2e340893bf',
                    VolumeSize: 80,
                    VolumeType: 'gp2'
                  },
                  NoDevice: false,
                  VirtualName: this.name + '-worker-' + this.dateStamp
                },
                /* more items */
              ],
            EbsOptimized: true,
            KeyName: this.keyName,
            InstanceMonitoring: {
                Enabled: true
            },
            SecurityGroups: [
               this.securityGroup
            ]
        }
    }
}


module.exports = new AWSFunctions()

