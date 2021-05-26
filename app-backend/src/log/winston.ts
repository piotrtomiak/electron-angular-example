import winston from "winston";
import logform, {Format} from "logform";
import colors from "colors/safe";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import {promises as fs} from "fs";
// @ts-ignore
import rimraf from "rimraf";
import {EventBus} from "../events/eventBus";

const {combine, timestamp, printf} = logform.format;

const messageTimestamp = timestamp({format: "YYYY-MM-DD HH:mm:ss.SSS"});
const MAX_LOG_FILES = 5;

function getLogDirName() {
  return process.env.APPLICATION_LOG_PATH ?? path.join(process.env.APPLICATION_DATA_PATH ?? "./", "logs");
}

export let context: {
  eventBus?: EventBus;
  getLogDirName: () => string;
} = {getLogDirName};

export function createWinstonLogger({levels, logLevel, filename, colorize, maxFiles}: {
  levels: {
    // noinspection JSUnusedLocalSymbols
    [name: string]: number;
  };
  logLevel: string;
  filename: string;
  colorize?: Format;
  maxFiles?: number;
}) {
  // noinspection JSIgnoredPromiseFromCall
  cleanupLogFiles(filename);
  return winston.createLogger({
    transports: [
      new DailyRotateFile({
        level: logLevel,
        filename,
        dirname: context.getLogDirName(),
        maxSize: "1m",
        maxFiles: maxFiles ?? 3,
        options: {flags: "a", encoding: "utf8"},
        zippedArchive: true,
        extension: ".log",
        format: combine(
            messageTimestamp,
            printf(({level, message, timestamp: timestampStr, prefix}) => {
              return `[${timestampStr}][${level.toUpperCase().padEnd(5, " ")}][${prefix}]: ${message}`;
            })
        )
      }),
      new (winston.transports.Console)({
        level: logLevel,
        format: combine(
            colorize ?? logform.format.colorize(),
            messageTimestamp,
            printf(({level, message, timestamp: timestampStr, prefix}) => {
              return `[${colors.grey(timestampStr)}][${level}][${colors.white(prefix)}]: ${message}`;
            })
        )
      })
    ],
    levels
  });
}

function safeJson(arg: object) {
  const processed = new Set();
  return JSON.stringify(arg, (key, value) => {
    if (processed.has(value)) {
      return "<duplicated>";
    }
    processed.add(value);
    return value;
  });
}

function mapMessage(...args: any[]) {
  return args.map((arg) => arg instanceof Error
      ? arg.stack
      : typeof arg === "object"
          ? safeJson(arg)
          : arg)
      .join(" ");
}

async function cleanupLogFiles(fileName: string) {
  const logDirName = context.getLogDirName();

  let sortedFiles: string[] = [];

  try {
    sortedFiles = (await fs.readdir(logDirName))
        .filter(f => f.startsWith(fileName + "."))
        .sort();
  } catch (e) {
  }

  if (sortedFiles.length >= MAX_LOG_FILES) {
    sortedFiles.slice(0, sortedFiles.length - MAX_LOG_FILES)
        .forEach(file => {
          rimraf.sync(path.join(logDirName, file));
        });
  }
}

export function wrapLogger(prefix: string, winstonLogger: any): any {
  const logger: any = {};
  for (const level of Object.keys(winstonLogger.levels)) {
    logger[level] = (...args: any[]) => {
      (winstonLogger as any)[level](mapMessage(...args), {prefix});
    };
  }
  return logger;
}
