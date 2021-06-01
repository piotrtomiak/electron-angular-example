# Angular + Electron Example

This repository contains an example desktop application built using Angular and Electron. 
It consists of 4 modules - common, backend, frontend and electron. 

## Structure

### Common
The common module contains type definitions and logic shared between all other modules to
facilitate communication and logging.

### Frontend
The frontend module contains Angular application, which uses NgRx store to manage state and
communicates with backend through IPC or WebSockets. The application is rendered in the 
Electron renderer process.

### Backend
The backend module provides the IPC or WebSocket server and handles DB access, business logic
and local machine resources access through Node.js APIs or native library bindings.

Important events (like profile creation) can be emitted to the `EventBus` and received by
services within the backend, frontend or electron module.

A logging service is configured to support a strictly typed log messages, which can easily
be internationalized or distinguished.

### Electron
The electron module bootstraps the application by initializing the backend server in IPC mode
and creating a single application window. The behaviour can be tweaked to support multiple 
windows.

## Development
The fastest way to start development is to install dependencies, run the build and link local packages:
```sh
yarn install
yarn build
yarn configure:local-pkgs
```
Yarn by default does not create symbolic links for packages with local references 
(e.g. `file:../`), but instead copies their content. We need to instruct Yarn to create 
symbolic links for the local versions of packages.

### Running
To start application in development mode, open two terminal sessions and in one of them run
```sh
cd app-frontend && yarn serve
```
Once the Angular application is built, in the other terminal run
```sh
cd app-electron && yarn start
```

### Rebuilding
The Angular application will automatically rebuild on changes and reload contents in the
Electron window. If you make changes to `common`, you need to rebuild it:
```sh
cd app-common && yarn build
```
Afterwards, or if you make changes in `backend`, you need to rebuild `backend`:
```sh
cd app-backend && yarn build
```
The electron is always build on start, so you can simply restart it:
```sh
cd app-electron && yarn start
```
You can also do the above three in a single command:
```sh
cd app-electron && yarn start:rebuild
```

### Running without Electron
The project is configured in such a way that you can run `backend` and `frontend` without
running Electron. This might be useful, e.g., when you need to debug frontend in Chrome, for any
reason.

First ensure that `common` module is up-to-date:
```sh
cd app-common && yarn build
```
Start the backend server in standalone mode:
```sh
cd app-backend && yarn serve
```
Start the frontend server:
```sh
cd app-frontend && yarn serve
```
Finally, open `http://localhost:4200` in your browser.

## Packaging

To prepare for the packaging, first build the application:
```sh
yarn build
```
It will be assembled into `build/desktop` directory. Next, you can run
```sh
yarn package:desktop
```
to create an installation package specific to your OS in `dist` folder, or
```sh
yarn release:desktop
```
to upload the new version to your update site. Please note, that update site
specific to your application must be configured in `app-electron/electron-builder.json`

