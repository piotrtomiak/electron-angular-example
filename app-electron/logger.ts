import {winston} from "app-backend";
import {app} from "electron";

winston.context.getLogDirName = () => app.getPath("logs");

const LEVELS = {
  crit: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  verbose: 5,
  silly: 6
};

const baseLogger = winston.createWinstonLogger({
  levels: LEVELS,
  logLevel: "debug",
  filename: "electron",
});
export default winston.wrapLogger("electron", baseLogger);




