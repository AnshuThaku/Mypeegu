require('dotenv').config() 
const config = require('config')

const myPeeguConfig = {
    app: {
        name: String(config.get('name')),
        environment: String(config.get('environment')),
        port: process.env.PORT || parseInt(config.get('port')) || 3004, 
        logLevel: String(config.get('logLevel')),
    },
    secrets: {
        superAdminKey: String(config.get('superAdminKey')),
        
        jwtPrivateKey: process.env.JWT_PRIVATE_KEY || String(config.get('jwtPrivateKey')),
        myPeeguAccessKeyId: process.env.AWS_ACCESS_KEY_ID || String(config.get('myPeeguAccessKeyId')),
        myPeeguSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || String(config.get('myPeeguSecretAccessKey')),
    },
    db: {
        path: process.env.MONGO_URI,
    },
}

const validateConfig = () => {
    if (!myPeeguConfig.secrets.jwtPrivateKey) throw new Error('FATAL ERROR: jwtPrivateKey is not defined')
}

module.exports.myPeeguConfig = myPeeguConfig
module.exports.validateConfig = validateConfig