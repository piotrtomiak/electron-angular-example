import {LoggingService} from "./log";
import {EventBus} from "./events/eventBus";
import {Server, ServerImpl, MessageHandler} from "./server";
import {StorageService} from "./storage";
import {context as winstonContext} from "./log/winston";

export * as winston from "./log/winston";
export {EventBus, ServerImpl, LoggingService, MessageHandler};

export class BackendServer {

  eventBus: EventBus;

  private server?: Server;

  constructor(private serverImpl: ServerImpl) {
    this.eventBus = new EventBus();
  }

  public onError(handler: (error: Error) => void) {
    this.server?.onError(handler);
  }

  public start() {
    winstonContext.eventBus = this.eventBus;

    const loggingService = new LoggingService(this.eventBus);

    const storageService = new StorageService(this.eventBus);

    this.server = new Server({
      logging: loggingService,
      eventBus: this.eventBus,
      storage: storageService,
    }, this.serverImpl);
  }

  public async stop() {
    await this.server?.stop();
    this.server = undefined;
  }

}
