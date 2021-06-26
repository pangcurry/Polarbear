const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const config = require('./config/env');
const morgan = require('morgan');
const { stream, logger } = require('./config/winston');

const app = express();

// const server = require('http').createServer(app);
// const io = require('socket.io')(server, { cors: { origin: "*" } });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(morgan('combined', { stream }));

// io.on('connection', socket =>  {
//     socket.emit("test", "hello!!!!!!");

//     socket.on("message", (data) => {
//         console.log(data);
//         io.emit('message', data);
//     });
//     socket.emit('polarbear-start', "hello polarbear!!!");
//     socket.emit('polarbear-message', 'fjdskl;');
//     socket.on('polarbear-message', data => {
//         console.log(data);
//         socket.emit('polarbear-messsage', "good");
//     });
// });

app.get('/test', (req,res) => {
    fs.readFile('C:/Users/user/Documents/Polarbear/Extensions/test.html', (err, data) => {
        if(err) { console.log(err) }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

app.post('/ping', (req,res) => {
    console.log('pong');
    console.log(req.body.videoId);
    res.status(200).json({
        message: "pong"
    });
});

const { getDownloadFilename } = require('./util/getDownloadFilename');
const mp3_folder = config.mp3_path;
const scriptPath = config.script_path;
const timeout = config.timeout;

app.post('/', async (req, res) => {
    try {
        let options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath,
            args: [req.body.videoId || req.query.v]
        }
        PythonShell.run('mp3.py', options, (err,result) => {
            if(err) { console.log(err.message) }
            if(!result) { 
                console.log('need pytube update !!!');
                res.status(500).json({
                    message: "server error"
                });
            }
            // console.log(result);
            const music_title = decodeURIComponent(result[0]);
            // console.log('music_title::::::::::::', music_title);
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
                    args: [result[0]]
                }
                setTimeout(() => {
                    PythonShell.run('remove.py', options, (err, result) => {
                        if(err) { throw err; }
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


        

        // let count = 0;
        // console.log('in server');
        // const mp3_name = 'aespa Next Level Lyrics (에스파 Next Level 가사) (Color Coded Lyrics).mp3';
        // const mp3_file = mp3_folder + mp3_name;
        // res.setHeader('Content-disposition', 'attachment; fileName=' + getDownloadFilename(req, mp3_name));
        // res.setHeader('Content-type', 'audio/mpeg');
        // const fileStream = fs.createReadStream(mp3_file);
        // fileStream.on('data', (data) => {
        //     count += 1;
        //     console.log(count, data);    
        // });
        
        // fileStream.pipe(res);



        // logger.info(music_title);
        // logger.info(result);
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
    if(!fs.existsSync("/polarbear/data/mp3")) {
        fs.mkdirSync("/polarbear/data/mp3")
    }
    if(!fs.existsSync("/polarbear/data/webm")) {
        fs.mkdirSync("/polarbear/data/webm")
    }
    console.log('server open on 3002 port !!!');
});
