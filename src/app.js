const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const morgan = require('morgan');

const { stream, logger } = require('./config/winston');
const { getDownloadFilename } = require('./util/getDownloadFilename');
const { KeyController } = require('./redis');
// const RedisConnection = require('./redis/connection'); //redis

//test
const redis = require('redis');
const config = require('./config/env');
const { video_table } = require('./config/env');
const client = redis.createClient();
client.on('error', (err) => {
    console.log('Error ' + err);
});
// table setting
console.log('make hmset');
// client.hmset(video_table, {
//     'videoCode': '0'
// });
//test

const app = express();
const mp3_folder = config.mp3_path;
const scriptPath = config.script_path;
const timeout = config.timeout;
// const redisConnection = new RedisConnection(); //redis

// redisConnection.setting(); //redis

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(morgan('combined', { stream }));

app.post('/ping', (req,res) => {
    console.log('pong');
    console.log(req.body.videoId);
    res.status(200).json({
        message: "pong"
    });
});

app.get('/test', async (req, res) => {
    console.log('test ok.');
    const key = req.body.videoId;
    const isWorking = 0;
    // const keyController = new KeyController(key);
    try {
        console.log('hi');
        client.set('StringKey','StringValue');
        client.get('StringKey', (err, reply) => {
            console.log(reply);
            res.status(200).json({
                message: "ha",
                data: reply
            });
        });
        
    }
    catch(e) {
        console.log(e.message);
        res.status(500).json({
            message:e.message
        });
    }
    



    // client.hmset('video_list', {
    //     'videoCode': '0'
    // });
    // client.hmset('video_list', 'dupang', 'good');
    // client.hdel('video_list','testKey');

    // client.exists(video_table, key, (err, result) => {
    //     if(err) {
    //         console.log(err);
    //         throw err;
    //     }
    //     console.log(result);
    //     if(!result) {

    //     }
    // });

    // client.hmget('video_list','testKey', (err, value) => {
    //     if(err) {
    //         console.log(err);
    //     }
    //     console.log(value);
    //     res.status(200).json({
    //         message: "good",
    //         data: value
    //     });
    // });
    // client.hgetall('video_list', (err, obj) => {
    //     if(err) throw err;
    //     console.log(obj);
    // });
    
});

app.post('/', async (req, res) => {
    try {
        let options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath,
            args: [req.body.videoId]
        }
        
        PythonShell.run('mp3.py', options, (err,result) => {
            if(err) { throw err; }
            // console.log(result);
            const music_title = decodeURIComponent(result[8]);
            // console.log(music_title);
            const mp3_file = mp3_folder + music_title + '.mp3';
            
            if(fs.existsSync(mp3_file)) {
                const mp3Name = music_title + '.mp3';
                // const mimetype = mime.getType(file);
                res.setHeader('Content-disposition', 'attachment; fileName=' + getDownloadFilename(req, mp3Name));
                res.setHeader('Content-type', 'audio/mpeg');
                const fileStream = fs.createReadStream(mp3_file);
                fileStream.pipe(res);
                logger.info(music_title);
                logger.info(result);
                options = {
                    mode: 'text',
                    pythonPath: '',
                    pythonOptions: ['-u'],
                    scriptPath,
                    args: [result[8]]
                }
                setTimeout(() => {
                    PythonShell.run('remove.py', options, (err, result) => {
                        if(err) { throw err; }
                        // console.log(result)
                        logger.info(result);
                    });
                }, timeout);
                
            }
            else {
                res.status(404).json({
                    message: '해당파일이 없습니다.'
                });
                // return;
            }
            // res.status(200).json({
            //     music_title: decodeURI(result[1])
            // });
        });
        // const music_title = ",,,,,,,,,,.mp3";   //test
        // const mp3_file = mp3_folder + music_title;  // test
        
        // if(fs.existsSync(mp3_file)) {
        //     const mp3Name = music_title + '.mp3';
        //     // const mimetype = mime.getType(file);
        //     res.setHeader('Content-disposition', 'attachment; fileName=' + getDownloadFilename(req, mp3Name));
        //     res.setHeader('Content-type', 'audio/mpeg');
        //     const fileStream = fs.createReadStream(mp3_file);
        //     fileStream.pipe(res);
        // }
        // else {
        //     res.status(404).json({
        //         message: '해당파일이 없습니다.'
        //     });
        //     // return;
        // }
        

    }
    catch(e) {
        console.log(e.message);
        res.status(500).json({
            message: e.message
        });
    }
});

// app.get('/:music_title', async (req,res) => {   // music_title : 음악의 제목만 전달
//     // const mp3_folder = 'C:/Users/user/Desktop/musicdown/mp3/';
//     const mp3_file = mp3_folder + req.params.music_title + '.mp3';
//     console.log(req.params.music_title);
//     console.log(mp3_file);
//     try {
//         if(fs.existsSync(mp3_file)) {
//             const mp3Name = req.params.music_title + '.mp3';
//             // const mimetype = mime.getType(file);
//             res.setHeader('Content-disposition', 'attachment; fileName=' + mp3Name);
//             res.setHeader('Content-type', 'audio/mpeg');
//             const fileStream = fs.createReadStream(mp3_file);
//             fileStream.pipe(res);
//         }
//         else {
//             res.status(404).json({
//                 message: '해당파일이 없습니다.'
//             });
//             // return;
//         }
//     } catch (e) {
//         console.log(e);
//         res.status(500).json({
//             message: e.message
//         });
//         // return;
//     }
// });

app.listen(config.port, () => {
    console.log('server open on 3002 port !!!');
});
