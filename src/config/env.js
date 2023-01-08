import dotenv from "dotenv";
import path from "path";
dotenv.config();

export const __dirname = path.resolve() + "/src";
// export const __dirname = path.resolve(); // 로컬

export const envList = {
  port: 80,
  mp3_path: __dirname + "/data/mp3",
  script_path: __dirname + "/Extractors",
  timeout: 5000,
};
