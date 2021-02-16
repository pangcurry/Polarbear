const express = require('express');
const fs = require('fs');

const cors = require('cors');
const { PythonShell } = require('python-shell');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post('/ping', (req,res) => {
    console.log('pong');
    console.log(req.body.videoId);
    res.status(200).json({
        message: "pong"
    });
});

const { getDownloadFilename } = require('./util/getDownloadFilename');
const mp3_folder = 'C:/Users/user/Documents/Polarbear/data/mp3/';
const scriptPath = 'C:/Users/user/Documents/Polarbear/src/Extractors';
const timeout = 3000;

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
            console.log(result);
            const music_title = decodeURIComponent(result[8]);
            console.log(music_title);
            const mp3_file = mp3_folder + music_title + '.mp3';
            
            if(fs.existsSync(mp3_file)) {
                const mp3Name = music_title + '.mp3';
                // const mimetype = mime.getType(file);
                res.setHeader('Content-disposition', 'attachment; fileName=' + getDownloadFilename(req, mp3Name));
                res.setHeader('Content-type', 'audio/mpeg');
                const fileStream = fs.createReadStream(mp3_file);
                fileStream.pipe(res);

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
                        console.log(result)
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

app.listen(3002, () => {
    console.log('server open on 3002 port !!!');
});
