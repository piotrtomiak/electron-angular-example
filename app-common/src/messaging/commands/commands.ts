import {LogEntry} from "../../model";

export enum CommandType {
  CreateProfile = "CreateProfile",
  UpdateProfile = "UpdateProfile",
  DeleteProfile = "DeleteProfile",
}

export enum CommandStatusKind {
  OK = "OK",
  Error = "Error"
}

export interface CommandStatus<Kind extends CommandStatusKind> {
  kind: CommandStatusKind;
}

export interface CommandStatusError extends CommandStatus<CommandStatusKind.Error> {
  errors: LogEntry[];
}

export interface CommandStatusOK extends CommandStatus<CommandStatusKind.OK> {
}

/** This interface is purely for typing purposes */
export interface Command<Type extends CommandType, CommandPayload = {}> {
  type: Type;
  payload: CommandPayload;
}

export type extractCommandType<Type> = Type extends Command<infer X, any> ? X : never;
export type extractCommandPayload<Type> = Type extends Command<any, infer X> ? X : never;

export interface CommandMessage<C extends Command<CommandType, any>> {
  id: string;
  name: extractCommandType<C>;
  payload: extractCommandPayload<C>;
}

export interface CommandMessageResponse<C extends Command<CommandType, any>> {
  id: string;
  name: extractCommandType<C>;
  status: CommandStatusOK | CommandStatusError;
}

export function isCommandMessage(obj: any): obj is CommandMessage<any> {
  return obj.name !== undefined && obj.name in CommandType && obj.id !== undefined && obj.payload !== undefined;
}

export function isCommandMessageResponse(obj: any): obj is CommandMessageResponse<any> {
  return obj.name !== undefined && obj.name in CommandType && obj.id !== undefined && obj.status !== undefined;
}

export type CommandCreator<Q extends Command<CommandType, any>> = (...params: any) => CommandMessage<Q>;
