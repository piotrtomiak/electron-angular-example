import {EventBus} from "./events/eventBus";
import {BackendServer} from "./index";
import {WebSocketServer} from "./server/webSocketServer";

export * as winston from "./log/winston";
export {EventBus};

const APPLICATION_SERVER_PORT = Number.parseInt(process.env.APPLICATION_SERVER_PORT ?? "4012", 10);

new BackendServer(new WebSocketServer(APPLICATION_SERVER_PORT)).start();
