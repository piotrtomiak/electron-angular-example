import {autoUpdater} from "electron-updater";
import log from "./logger";
import {BrowserWindow, dialog} from "electron";
import {ProgressInfo, UpdateInfo} from "builder-util-runtime";
import {EventBus} from "app-backend";
import {EventType} from "app-common";

export enum UpdateChannel {
  Stable = "stable"
}

export class ApplicationAutoUpdater {
  constructor(private win: BrowserWindow, private channel: UpdateChannel, private serverEventBus: EventBus) {
    autoUpdater.logger = log;
    autoUpdater.channel = channel;
  }

  async start() {
    this.bindEvents();

    await autoUpdater.checkForUpdatesAndNotify();
  }

  private bindEvents() {
    autoUpdater.on("update-available", async () => {
      this.serverEventBus.broadcast(EventType.UpdateDownloadStarted, {});
    });

    autoUpdater.on("download-progress", (progress: ProgressInfo) => {
      this.win.setProgressBar(progress.percent / 100.0);
      this.serverEventBus.broadcast(EventType.UpdateDownloadProgress, progress);
    });

    autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
      this.serverEventBus.broadcast(EventType.UpdateDownloadFinished, {});

      let message;

      if (info.releaseNotes && !Array.isArray(info.releaseNotes)) {
        message = info.releaseNotes;
      } else if (Array.isArray(info.releaseNotes)) {
        message = info.releaseNotes[0].note
            ? `${info.releaseNotes[0].note}`
            : `v${info.version}`;
      } else {
        message = `v${info.version}`;
      }

      const dialogOpts = {
        type: "info",
        buttons: ["Restart", "Later"],
        title: "Application Update",
        message,
        detail: "A new version has been downloaded. Restart the application to apply the updates."
      };

      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });
  }
}

