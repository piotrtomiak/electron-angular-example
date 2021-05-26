import {promises as fsp} from "fs";

export type FileContentsTransformer = (content: string) => string;

export async function replaceFileContents(path: string, transformer: FileContentsTransformer) {
  let fh: fsp.FileHandle | null = null;
  let content: string = "";

  try {
    fh = await fsp.open(path, "r");

    if (fh) {
      content = (await fh.readFile()).toString();
    }
  } finally {
    if (fh) {
      await fh.close();
    }
  }

  try {
    fh = await fsp.open(path, "w");

    if (fh) {
      await fh.writeFile(transformer(content));
    }
  } finally {
    if (fh) {
      await fh.close();
    }
  }
}

export async function readJSON(path: string): Promise<{}> {
  let fh: fsp.FileHandle | null = null;
  let content: {} = {};

  try {
    fh = await fsp.open(path, "r");

    if (fh) {
      content = JSON.parse((await fh.readFile()).toString());
    }
  } finally {
    if (fh) {
      await fh.close();
    }
  }

  return content;
}

export async function writeJSON(path: string, content: {}): Promise<boolean> {
  let fh: fsp.FileHandle | null = null;

  try {
    fh = await fsp.open(path, "w");

    if (fh) {
      await fh.writeFile(JSON.stringify(content));
    }
  } finally {
    if (fh) {
      await fh.close();
    }
  }

  return true;
}
