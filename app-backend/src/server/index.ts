import {CommandType, EventType, MessageCode, QueryType} from "app-common";
import {EventBus} from "../events/eventBus";
import {StorageService} from "../storage";
import {createProfileCommandHandler, deleteProfileCommandHandler, updateProfileCommandHandler,} from "./handlers/commands/profiles";
import {listProfilesQueryHandler} from "./handlers/queries/profiles";
import {MessageRouter} from "./message-router";
import {LoggingService} from "../log";

export interface ServicesContext {
  eventBus: EventBus;
  logging: LoggingService;
  storage: StorageService;
}

export interface SessionContext {
  services: ServicesContext;
  clientId: string;
}

export type MessageHandler = (clientId: string, data: string, replyHandler: (json: string) => void) => void;

export interface ServerImpl {

  start(logging: LoggingService, messageHandler: MessageHandler): void;

  broadcast(json: string): void;

  stop(): Promise<void>;

  onError(handler: (error: Error) => void): void;
}

export class Server {

  private readonly messageRouter: MessageRouter;

  public constructor(public context: ServicesContext,
                     public serverImpl: ServerImpl) {
    this.messageRouter = new MessageRouter({
          [CommandType.CreateProfile]: createProfileCommandHandler,
          [CommandType.UpdateProfile]: updateProfileCommandHandler,
          [CommandType.DeleteProfile]: deleteProfileCommandHandler,

          [QueryType.ListProfiles]: listProfilesQueryHandler,
        },
        this.context
    );

    serverImpl.start(context.logging,
        (clientId, data, replyHandler) => this.messageRouter.route(clientId, data, replyHandler));

    for (const eventType of Object.keys(EventType)) {
      if (eventType === EventType.LogEntry) {
        continue;
      }
      context.eventBus.subscribe(eventType as EventType, eventData => {
        this.context.logging.debug(MessageCode.DebugEventBroadcast, JSON.stringify({
          name: eventType,
          payload: eventData
        }));
        this.serverImpl.broadcast(JSON.stringify({
          name: eventType,
          time: new Date().getTime(),
          payload: eventData
        }));
      });
    }
  }

  public onError(handler: (error: Error) => void) {
    this.serverImpl.onError(handler);
  }

  public async stop() {
    return this.serverImpl.stop();
  }
}




