import messagesJson from "./messages.json";

export enum Severity {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL"
}

export interface LogEntry {
  profileId?: number;
  severity: Severity;
  code: MessageCode;
  data?: any[];
  stackTrace?: string;
}

export function throwError(errorCode: MessageCode, ...args: any[]) {
  throw new ApplicationError({code: errorCode, data: args, severity: Severity.ERROR});
}

export function throwCriticalError(errorCode: MessageCode, ...args: any[]) {
  throw new ApplicationError({code: errorCode, data: args, severity: Severity.CRITICAL});
}

export class ApplicationError extends Error {

  constructor(private logEntry: LogEntry) {
    super();
  }

  getLogEntry(): LogEntry {
    return this.logEntry;
  }

  get message(): string {
    return getLogEntryMessage(this.logEntry);
  }
}

export function createLogEntryForError(code: MessageCode, error: Error): LogEntry {
  let entry: LogEntry;
  if (error instanceof ApplicationError) {
    entry = error.getLogEntry();
  } else {
    entry = {code, severity: Severity.CRITICAL};
    entry.stackTrace = error.stack;
  }
  return entry;
}

export function format(str: string, ...args: any[]) {
  return str.replace(/{(\d+)}/g, (val, param1) => {
    return args[param1];
  });
}

export type MessageCode = keyof typeof messagesJson;
export const MessageCode: { [key in MessageCode]: key } = {} as any;
for (const code of Object.keys(messagesJson)) {
  (MessageCode as any)[code] = code;
}

export function getLogEntryMessage(entry: LogEntry) {
  const text = messagesJson[entry.code];
  if (text === undefined) {
    throw new Error(`No message for code ${entry.code}`);
  }
  return format(text, ...(entry.data || []));
}
