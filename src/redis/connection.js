const redis = require('redis');
const config = require('../config/env');

const client = redis.createClient()

class RedisConnection {
    constructor() {
        this.client = client;
        this.video_table = config.video_table;
    }
    
    setting = () => {
        // error
        this.client.on('error', (err) => {
            console.log('Error ' + err);
        });
    
        // table setting
        console.log('make hmset');
        this.client.hmset(this.video_table, {
            'videoCode': '0'
        });   
    }

}

module.exports = RedisConnection;   
