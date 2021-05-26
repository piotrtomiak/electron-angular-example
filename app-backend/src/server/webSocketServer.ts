import {MessageHandler, ServerImpl} from "./index";
import express from "express";
import http from "http";
import WebSocket from "ws";
import {ConnectionPool} from "./pool";
import {createLogEntryForError, MessageCode} from "app-common";
import {LoggingService} from "../log";

export class WebSocketServer implements ServerImpl {

  private readonly app = express();
  private readonly server = http.createServer(this.app);
  private readonly wss = new WebSocket.Server({server: this.server});

  private readonly pool = new ConnectionPool();
  private logging!: LoggingService;

  constructor(private port: number) {
  }

  start(logging: LoggingService, messageHandler: MessageHandler) {
    this.logging = logging;
    this.wss.on("connection", (ws: WebSocket) => {
      const clientId = this.pool.register(ws);

      ws.on("message", async msg => {
        try {
          if (typeof msg === "string") {
            const data = JSON.parse(msg);
            await messageHandler(clientId, data, json => {
              this.pool.send(clientId, json);
            });
          } else {
            logging.critical(MessageCode.StringMessageExpected, typeof msg);
          }
        } catch (e) {
          const entry = createLogEntryForError(MessageCode.FailedToRouteMessage, e);
          logging.log(entry);
        }
      });

      ws.on("close", () => {
        this.pool.unregister(clientId);
      });
    });
    this.wss.on("error", error => {
      logging.critical(MessageCode.ServerError, error.stack);
    });

    this.server.listen(this.port, () => {
      logging.info(MessageCode.ServerStarted, this.port);
    });
  }

  broadcast(json: string) {
    this.pool.broadcast(json);
  }

  stop() {
    return new Promise<void>((resolve, reject) => {
      this.wss.close((err) => {
        if (err) {
          this.logging.error(MessageCode.ErrorStoppingServer, err.stack);
          reject(err);
        } else {
          this.logging.info(MessageCode.ServerStopped);
          resolve();
        }
      });
    });
  }

  onError(handler: (error: Error) => void) {
    this.wss.on("error", handler);
  }

}
