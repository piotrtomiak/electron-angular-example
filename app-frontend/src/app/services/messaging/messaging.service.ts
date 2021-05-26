import {Inject, Injectable, NgZone} from "@angular/core";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";

import {MessageMapper} from "./message-mapper";
import {MessagingConfigService} from "./messaging-config.service";
import {delay, retryWhen, tap} from "rxjs/operators";

const RECONNECT_INTERVAL = 5000;

let ipcRenderer: any;

try {
  ipcRenderer = (window as any).require("electron").ipcRenderer;
} catch (e) {
}

export interface MessagingConfig {
  url: string;
}

@Injectable()
export class MessagingService {
  private ws$: WebSocketSubject<any> | null = null;

  constructor(@Inject(MessagingConfigService) private config: MessagingConfig,
              @Inject(MessageMapper) private mapper: MessageMapper,
              private ngZone: NgZone) {
    this.connect();
  }

  send(obj: any) {
    if (ipcRenderer) {
      ipcRenderer.send("server-messages", JSON.stringify(obj));
    } else {
      this.ws$?.next(obj);
    }
  }

  connect() {
    this.close();
    if (ipcRenderer) {
      ipcRenderer.on("server-messages", (event: any, msg: string) =>
          this.ngZone.run(() => {
            this.mapper.map(JSON.parse(msg));
          })
      );
    } else {
      this.ws$ = webSocket(this.config.url);

      this.ws$.pipe(
          retryWhen(errors => errors.pipe(
                  tap(err => this.mapper.error(err)),
                  delay(RECONNECT_INTERVAL)
              )
          )
      ).subscribe(msg => this.mapper.map(msg));
    }
  }

  close() {
    if (this.ws$) {
      this.ws$.complete();
    }
    if (ipcRenderer) {
      ipcRenderer.removeAllListeners("server-messages");
    }
  }
}
