import {LogEntry} from "../../model";

export enum QueryType {
  ListProfiles = "ListProfiles",
}

export enum QueryStatusKind {
  OK = "OK",
  Error = "Error"
}

export interface QueryStatus<Kind extends QueryStatusKind> {
  kind: QueryStatusKind;
}

export interface QueryStatusError extends QueryStatus<QueryStatusKind.Error> {
  errors: LogEntry[];
}

export interface QueryStatusOK extends QueryStatus<QueryStatusKind.OK> {
}

/** This interface is purely for typing purposes */
export interface Query<Type extends QueryType, QueryPayload, ResponsePayload> {
  type: Type;
  queryPayload: QueryPayload;
  responsePayload: ResponsePayload;
}

export type extractQueryType<Type> = Type extends Query<infer X, any, any> ? X : never;
export type extractQueryPayload<Type> = Type extends Query<any, infer X, any> ? X : never;
export type extractQueryResponsePayload<Type> = Type extends Query<any, any, infer X> ? X : never;

export interface QueryMessage<Q extends Query<QueryType, any, any>> {
  id: string;
  name: extractQueryType<Q>;
  payload?: extractQueryPayload<Q>;
}

export interface QueryMessageResponse<Q extends Query<QueryType, any, any>> {
  id: string;
  name: extractQueryType<Q>;
  status: QueryStatusError | QueryStatusOK;
  payload?: extractQueryResponsePayload<Q>;
}

export function isQueryMessage(obj: any): obj is QueryMessage<any> {
  return obj.name !== undefined && obj.name in QueryType && obj.id !== undefined && obj.payload !== undefined;
}

export function isQueryMessageResponse(obj: any): obj is QueryMessageResponse<any> {
  return obj.name !== undefined && obj.name in QueryType && obj.id !== undefined && obj.status !== undefined;
}

export type QueryCreator<Q extends Query<QueryType, any, any>> = (...params: any) => QueryMessage<Q>;
