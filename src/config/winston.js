import fs from "fs";
import path from "path";
import winston from "winston";
import { __dirname } from "./env.js";
// const __dirname = path.resolve();

const logDir = __dirname + "/../../logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const infoTransport = new winston.transports.File({
  filename: "info.log",
  dirname: logDir,
  level: "info",
});

const errorTransport = new winston.transports.File({
  filename: "error.log",
  dirname: logDir,
  level: "error",
});

export const logger = winston.createLogger({
  transports: [infoTransport, errorTransport],
});

export const stream = {
  write: (message) => {
    logger.info(message);
  },
};
