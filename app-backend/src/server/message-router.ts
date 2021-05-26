import {
  Command,
  CommandMessage,
  CommandMessageResponse,
  CommandStatusKind,
  CommandType,
  createLogEntryForError,
  isCommandMessage,
  isQueryMessage,
  MessageCode,
  Query,
  QueryMessage,
  QueryMessageResponse,
  QueryStatusKind,
  QueryType
} from "app-common";
import {CommandHandler, QueryHandler} from "./handlers";
import {ServicesContext} from "./index";

export class MessageRouter {
  constructor(
      private handlers: { [key in CommandType]: CommandHandler<Command<key, any>> }
          & { [key in QueryType]: QueryHandler<Query<key, any, any>> },
      private servicesContext: ServicesContext
  ) {
  }

  async route(clientId: string, data: string, replyHandler: (json: string) => void) {
    let response: any;
    this.servicesContext.logging.debug(MessageCode.DebugMessageProcessStarted, JSON.stringify(data));
    if (isQueryMessage(data)) {
      response = await this.routeQuery(clientId, data);
    } else if (isCommandMessage(data)) {
      response = await this.routeCommand(clientId, data);
    } else {
      throw Error(`Expected query or command message, got "${data}"`);
    }
    this.servicesContext.logging.debug(MessageCode.DebugMessageProcessFinished, JSON.stringify(response));
    if (response) {
      replyHandler(JSON.stringify(response));
    }
  }

  async routeQuery(clientId: string, queryMessage: QueryMessage<any>): Promise<QueryMessageResponse<any>> {
    try {
      const context = {services: this.servicesContext, clientId};

      return {
        id: queryMessage.id,
        name: queryMessage.name,
        payload: await this.handlers[queryMessage.name](context, queryMessage.payload),
        status: {
          kind: QueryStatusKind.OK
        }
      };
    } catch (e) {
      const entry = createLogEntryForError(MessageCode.QueryFailed, e);
      this.servicesContext.logging.log(entry);
      return {
        id: queryMessage.id,
        name: queryMessage.name,
        status: {
          kind: QueryStatusKind.Error,
          errors: [entry]
        }
      };
    }
  }

  async routeCommand(clientId: string, commandMessage: CommandMessage<any>): Promise<CommandMessageResponse<any>> {
    try {
      const context = {services: this.servicesContext, clientId};

      await this.handlers[commandMessage.name](context, commandMessage.payload);
      return {
        id: commandMessage.id,
        name: commandMessage.name,
        status: {
          kind: CommandStatusKind.OK
        }
      };
    } catch (e) {
      const entry = createLogEntryForError(MessageCode.CommandFailed, e);
      this.servicesContext.logging.log(entry);
      return {
        id: commandMessage.id,
        name: commandMessage.name,
        status: {
          kind: CommandStatusKind.Error,
          errors: [entry]
        }
      };
    }
  }
}
