let AWS = require('aws-sdk');
AWS.config.region = process.env.AWS_REGION || 'us-east-1';

const DDB_TABLE = 'Recipes'
const VOICE = 'Matthew';

module.exports = {
    'AWS': AWS,
    'DDB_TABLE': DDB_TABLE,
    'VOICE': VOICE
}
