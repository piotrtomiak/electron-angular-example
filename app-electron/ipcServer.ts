import {LoggingService, MessageHandler, ServerImpl} from "app-backend";
import {ipcMain, webContents} from "electron";
import {createLogEntryForError, MessageCode} from "app-common";

export class IpcServer implements ServerImpl {

  start(logging: LoggingService, messageHandler: MessageHandler) {
    logging.info(MessageCode.ServerStarted, "IPC");
    ipcMain.on("server-messages", (event, arg) => {
      try {
        messageHandler(event.processId.toString(10) + "#" + event.frameId.toString(10), JSON.parse(arg), json => {
          event.reply("server-messages", json);
        });
      } catch (e) {
        const entry = createLogEntryForError(MessageCode.FailedToRouteMessage, e);
        logging.log(entry);
      }
    });
  }

  broadcast(json: string): void {
    webContents.getAllWebContents().forEach(contents =>
        contents.send("server-messages", json)
    );
  }

  onError(handler: (error: Error) => void): void {
  }

  stop(): Promise<void> {
    ipcMain.removeHandler("server-messages");
    return Promise.resolve(undefined);
  }

}
