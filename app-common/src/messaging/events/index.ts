export * from "./profiles";
export * from "./logging";

export enum EventType {
  ProfileCreated = "ProfileCreated",
  ProfileUpdated = "ProfileUpdated",
  ProfileDeleted = "ProfileDeleted",

  UpdateDownloadStarted = "UpdateDownloadStarted",
  UpdateDownloadProgress = "UpdateDownloadProgress",
  UpdateDownloadFinished = "UpdateDownloadFinished",

  LogEntry = "LogEntry",
}

/** This interface is purely for typing purposes */
export interface ServerEvent<Type extends EventType, Data> {
  type: Type;
  data: Data;
}

export type extractEventType<Type> = Type extends ServerEvent<infer X, any> ? X : never;
export type extractEventPayload<Type> = Type extends ServerEvent<any, infer X> ? X : never;

export interface EventMessage<E extends ServerEvent<EventType, any>> {
  name: extractEventType<E>;
  time: number;
  payload: extractEventPayload<E>;
}

export function isEventMessage(obj: any): obj is EventMessage<any> {
  return obj.name !== undefined && obj.name in EventType;
}

