// const RedisConnection = require('./connection');

//test
const redis = require('redis');
const config = require('../config/env');
const client = redis.createClient();
const video_table = config.video_table;
client.on('error', (err) => {
    console.log('Error ' + err);
});
client.hmset(video_table, {
    'videoCode': '0'
}); 
//test

module.exports = class KeyController {
    constructor(key) {
        this.key = key;
    }

    isExist() {
        console.log('in isExist');
        client.exists(video_table, this.key, (err, result) => {
            if(err) {
                console.log(err);
                throw err;
            }
            return result;
        });
    };

    generateKey(isWorking) {
        console.log('in generateKey');
        isWorking = isWorking * "";
        console.log('========================');
        console.log(video_table);
        console.log(this.key);
        console.log(isWorking);
        console.log('========================');
        client.hmset(video_table, this.key, isWorking);
        // 잘 들어갔는지 확인해야하나?
    };    

    removeKey() {
        console.log('in removeKey');
        // 잘 삭제 되었는지 확인해야하는가?
        client.hdel(video_table, this.key, (err, result) => {
            if(err) {
                console.log(err);
                throw err;
            }
            return result;
        });
    };

    getValue() {
        console.log('in getValue');
        client.hmget(video_table, this.key, (err, value) => {
            if(err) {
                console.log(err);
                throw err;
            }
            return value;
        });
    };

    getKeyall() {
        console.log('========================');
        console.log(video_table);
        console.log('========================');
        client.hgetall(video_table, (err, obj) => {
            if(err) {
                console.log(err);
                throw err;
            }
            return obj;
        });
    }

};
