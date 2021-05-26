import {EventType, ServerEvent} from "./index";
import {LogEntry} from "../../model";

export interface LogEntryEvent extends ServerEvent<EventType.LogEntry, {
  entry: LogEntry;
}> {
}
