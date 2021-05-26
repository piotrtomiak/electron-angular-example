import * as url from "url";
import {app, BrowserWindow, shell} from "electron";
import {ApplicationAutoUpdater, UpdateChannel} from "./auto-updater";
import windowStateKeeper from "electron-window-state";
import {BackendServer, winston} from "app-backend";
import logger from "./logger";
import {IpcServer} from "./ipcServer";

const args = process.argv.slice(1);

let environment: any

if (args.indexOf("--dev") >= 0) {
  environment = require("./environments/environment").default
} else {
  environment = require("./environments/environment.prod").default
}

const DISABLE_AUTO_UPDATES = args.find(arg => arg === "--disable-auto-updates") !== undefined;

let win: BrowserWindow | null = null;
let backendServer: BackendServer | null = null;
let autoUpdater: ApplicationAutoUpdater | null = null;

const frontendLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};
const frontendLogger = winston.createWinstonLogger({
  filename: "frontend",
  levels: frontendLevels,
  logLevel: "debug"
});

async function startBackend() {
  backendServer = new BackendServer(new IpcServer());
  backendServer.onError(createCriticalErrorWindow);
  backendServer.start();
}

async function startAutoUpdater(window: BrowserWindow) {
  autoUpdater = new ApplicationAutoUpdater(window, UpdateChannel.Stable, backendServer!!.eventBus);
  await autoUpdater.start();
}

async function createCriticalErrorWindow(error: Error): Promise<BrowserWindow> {
  logger.error(error);

  if (win) {
    win.close();
  }

  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
    },
  });

  win.setMenuBarVisibility(false);

  const criticalErrorHTML = `<b>Critical error</b>:<br/>
    <pre>${error.stack?.replace("<", "&lt;")}</pre>
    <br/>
    See error log at <a href='file://${process.env.APPLICATION_LOG_PATH}' target="_blank">${process.env.APPLICATION_LOG_PATH}</a>`;

  await win.loadURL("data:text/html;base64," + new Buffer(criticalErrorHTML).toString("base64"));

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.quit();
    win = null;
  });

  return win;
}

async function createWindow(): Promise<BrowserWindow | undefined> {
  if (win !== null) {
    return;
  }

  const mainWindowState = windowStateKeeper({
    defaultHeight: 800,
    defaultWidth: 1200
  });

  // Create the browser window.
  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: true,
      devTools: environment.enableDevTools,
    },
  });
  mainWindowState.manage(win);

  win.setMenuBarVisibility(false);

  win.webContents.on("new-window", (event, navigateUrl) => {
    if (navigateUrl !== win?.webContents.getURL()) {
      event.preventDefault();

      shell.openExternal(navigateUrl);
    }
  });

  win.webContents.on("console-message", (event, level, message, line, sourceId) => {
    const logMethod = Object.keys(frontendLevels).find(k => (frontendLevels as any)[k] === 3 - level);
    frontendLogger[logMethod as keyof typeof frontendLogger](
        (sourceId ? `[${sourceId + (line !== undefined ? ":" + line : "")}] ` : "") + message, {prefix: "frontend"}
    );
  });

  await win.loadURL(url.format({
    pathname: environment.application.contents.path,
    protocol: environment.application.contents.protocol,
    slashes: true
  }));

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

let initialized = false;

async function initializeServices() {
  if (initialized) {
    return;
  }
  initialized = true;
  await startBackend();
}

async function main() {
  try {
    app.on("ready", async () => {
      try {
        await initializeServices();
      } catch (e) {
        await createCriticalErrorWindow(e);
        return;
      }
      const localWin = await createWindow();
      if (localWin && !DISABLE_AUTO_UPDATES) {
        await startAutoUpdater(localWin);
      }
    });

    // Quit when all windows are closed.
    app.on("window-all-closed", () => {
      app.quit();
    });

    app.on("activate", async () => {
      // On OS X it"s common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null) {
        await createWindow();
      }
    });

    app.on("before-quit", async () => {
      if (backendServer != null) {
        await backendServer.stop();
      }
    });
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}

// noinspection JSIgnoredPromiseFromCall
main();

