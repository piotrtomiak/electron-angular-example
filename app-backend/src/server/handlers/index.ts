import {
  Command,
  CommandType,
  extractCommandPayload,
  extractQueryPayload,
  extractQueryResponsePayload,
  Query,
  QueryType
} from "app-common";
import {SessionContext} from "../index";

export type CommandHandler<C extends Command<CommandType, any>> =
    (context: SessionContext, command: extractCommandPayload<C>) => Promise<void> | void;

export function createCommandHandler<C extends Command<CommandType, any>>(handler: CommandHandler<C>): CommandHandler<C> {
  return handler;
}

export type QueryHandler<Q extends Query<QueryType, any, any>> =
    (context: SessionContext, query: extractQueryPayload<Q>) => Promise<extractQueryResponsePayload<Q>>;

export function createQueryHandler<Q extends Query<QueryType, any, any>>(handler: QueryHandler<Q>): QueryHandler<Q> {
  return handler;
}
