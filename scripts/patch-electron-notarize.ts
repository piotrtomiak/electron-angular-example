import {FileContentsTransformer, replaceFileContents} from "./common";

const ELECTRON_NOTARIZE_INDEX_PATH = "build/desktop/node_modules/electron-notarize/lib/index.js";

async function main() {
  const transformer: FileContentsTransformer = (content: string) => {
    return content.replace(
        "spawn('zip', ['-r', '-y', zipPath, path.basename(opts.appPath)]",
        "spawn('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', path.basename(opts.appPath), zipPath]"
    );
  };

  await replaceFileContents(ELECTRON_NOTARIZE_INDEX_PATH, transformer);
}

// noinspection JSIgnoredPromiseFromCall
main();
