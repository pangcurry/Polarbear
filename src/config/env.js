 require('dotenv').config();

module.exports = {
    port: process.env.SERVER_PORT,
    mp3_path: process.env.MP3_PATH,
    script_path: process.env.SCRIPT_PATH,
    timeout: process.env.TIMEOUT,
    video_table: process.env.VIDEO_TABLE
};
