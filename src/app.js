import express from "express";
import fs from "fs";
import cors from "cors";
import { PythonShell } from "python-shell";
import { envList as config, __dirname } from "./config/env.js";
import morgan from "morgan";
import { stream, logger } from "./config/winston.js";
import path from "path";
import { getDownloadFilename } from "./util/getDownloadFilename.js";

// export const __dirname = path.resolve() + "/src";
// export const __dirname = path.resolve(); // 로컬

const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server, { cors: { origin: "*" } });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(morgan("combined", { stream }));

app.post("/ping", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.client._peername.address;
  console.log(req.headers);
  console.log("pong");
  console.log("[ip]>>>", ip);
  console.log("[body]>>>", req.body);
  res.status(200).json({
    message: "pong",
  });
});

const mp3_folder = config.mp3_path;
const scriptPath = config.script_path;
const timeout = config.timeout;

app.get("/", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.client._peername.address;
    console.log("[ ip ] >>> ", ip);
    let options = {
      mode: "text",
      pythonPath: "",
      pythonOptions: ["-u"],
      scriptPath,
      args: [req.body.videoId || req.query.v],
    };
    PythonShell.run("mp3.py", options, (err, result) => {
      if (err) {
        console.log(err.message);
      }
      if (!result) {
        console.log("need pytube update !!!");
        res.status(500).json({
          message: "server error",
        });
      }
      try {
        console.log(result);
        const music_title = decodeURIComponent(result[-0]);
        console.log("music_title::::::::::::", music_title);
        const mp3_file = `${mp3_folder}/${music_title}.mp3`;
        console.log("최종 파일 이름 ::: ", mp3_file);
        if (fs.existsSync(mp3_file)) {
          const mp3Name = music_title + ".mp3";
          // const mimetype = mime.getType(file);
          res.setHeader(
            "Content-disposition",
            "attachment; fileName=" + getDownloadFilename(req, mp3Name)
          );
          res.setHeader("Content-type", "audio/mpeg");
          const fileStream = fs.createReadStream(mp3_file);
          fileStream.pipe(res);
          logger.info(music_title);
          logger.info(result);
          options = {
            mode: "text",
            pythonPath: "",
            pythonOptions: ["-u"],
            scriptPath,
            args: [result[-0]],
          };
          setTimeout(() => {
            console.log("실행함");
            PythonShell.run("remove.py", options, (err, result) => {
              try {
                console.log("들어옴 ? ", err, result);
                if (err) {
                  throw err;
                }
                logger.info(result);
              } catch (err) {
                console.error("Can not remove files ! ", err);
              }
            });
          }, timeout);
        } else {
          res.status(404).json({
            message: "해당파일이 없습니다.",
          });
          // return;
        }
      } catch (err) {
        console.log(err, "에러남");
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
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: e.message,
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
  console.log(config.port);
  console.log(__dirname);
  if (!fs.existsSync(__dirname + "/data/mp3")) {
    fs.mkdirSync(__dirname + "/data/mp3", { recursive: true });
  }
  if (!fs.existsSync(__dirname + "/data/webm")) {
    fs.mkdirSync(__dirname + "/data/webm", { recursive: true });
  }
  console.log("server open on 3002 port !!!");
});
