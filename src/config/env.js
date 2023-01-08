import dotenv from "dotenv";
import path from "path";
dotenv.config();

const __dirname = path.resolve() + "/src";

const envList = {
  port: 3002,
  mp3_path: __dirname + "/data/mp3",
  script_path: __dirname + "/Extractors",
  timeout: 5000,
};

export default envList;
