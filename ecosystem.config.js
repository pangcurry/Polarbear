module.exports = {
    apps : [{
        name: "polarbear",
        script: "./src/app.js",
        watch: true,
        ignore_watch: [
            "extensions",
            "node_modules",
            "logs",
            "data",
            "ffmpeg"
        ],
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production"
        }
    }]
}
