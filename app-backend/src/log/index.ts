import {EventType, getLogEntryMessage, LogEntry, LogEntryEvent, MessageCode, Severity} from "app-common";

import {EventBus} from "../events/eventBus";

import {Logger} from "winston";
import {createWinstonLogger} from "./winston";

const LOG_FILENAME = "backend";
const LOG_PREFIX = "application";

export class LoggingService {

  private readonly logger: Logger;

  constructor(private eventBus: EventBus) {
    // default logging to console and file
    this.eventBus.subscribe<LogEntryEvent>(EventType.LogEntry, eventData => {
      const message = getLogEntryMessage(eventData.entry)
          + (eventData.entry.stackTrace ? "\n" + eventData.entry.stackTrace : "");
      this.logToWinston(message, eventData.entry.severity);
    });
    this.logger = createWinstonLogger({
      filename: LOG_FILENAME,
      levels: {
        crit: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5
      },
      logLevel: "debug"
    });
  }

  debug(code: MessageCode, ...args: any[]) {
    this.log({severity: Severity.DEBUG, code, data: args});
  }

  info(code: MessageCode, ...args: any[]) {
    this.log({severity: Severity.INFO, code, data: args});
  }

  warning(code: MessageCode, ...args: any[]) {
    this.log({severity: Severity.WARNING, code, data: args});
  }

  error(code: MessageCode, stackTrace?: string, ...args: any[]) {
    this.log({severity: Severity.ERROR, code, data: args, stackTrace});
  }

  critical(code: MessageCode, stackTrace?: string, ...args: any[]) {
    this.log({severity: Severity.CRITICAL, code, data: args, stackTrace});
  }

  log(entry: LogEntry) {
    this.eventBus.broadcast<LogEntryEvent>(EventType.LogEntry, {entry});
  }

  private logToWinston(message: string, severity: Severity) {
    let winstonLevel = severity.toLowerCase();
    if (winstonLevel === "warning") {
      winstonLevel = "warn";
    } else if (winstonLevel === "critical") {
      winstonLevel = "crit";
    }
    (this.logger as any)[winstonLevel](message, {prefix: LOG_PREFIX});
  }

}
