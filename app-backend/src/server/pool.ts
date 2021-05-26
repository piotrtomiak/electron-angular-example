import {v4 as uuidv4} from "uuid";
import WebSocket from "ws";

export interface Client {
  id: string;
  ws: WebSocket;
}

export type Message = string | Buffer | ArrayBuffer | Buffer[];

export class ConnectionPool {
  private clients: { [key: string]: Client } = {};

  broadcast(message: Message) {
    for (const client of Object.values(this.clients)) {
      client.ws.send(message);
    }
  }

  send(clientId: string, message: Message) {
    if (clientId in this.clients) {
      this.clients[clientId].ws.send(message);
    }
  }

  register(ws: WebSocket) {
    const clientId = uuidv4();

    this.clients[clientId] = {id: clientId, ws};

    return clientId;
  }

  unregister(clientId: string) {
    if (clientId in this.clients) {
      if (this.clients[clientId].ws?.OPEN) {
        this.clients[clientId].ws?.close();
      }

      delete this.clients[clientId];
    }
  }
}
