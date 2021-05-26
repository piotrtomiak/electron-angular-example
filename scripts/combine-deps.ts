import semver from "semver/preload";

import {readJSON, writeJSON} from "./common";

type Package = any;
type Dependencies = { [name: string]: string };
type ScannedDependencies = { [name: string]: string[] };

function scan(packages: Package[]): ScannedDependencies {
  const deps: ScannedDependencies = {};

  for (const p of packages) {
    for (let dep in (p.dependencies ?? {})) {
      if (!deps.hasOwnProperty(dep)) {
        deps[dep] = [];
      }

      deps[dep].push(p.dependencies[dep]);
    }
  }

  return deps;
}

function map(deps: ScannedDependencies): Dependencies {
  const result: Dependencies = {};

  for (const dep in deps) {
    let fallbackVersion = deps[dep][0];
    let coercedNewest = null;

    for (const version of deps[dep]) {
      let coercedVersion = semver.coerce(version);

      if (coercedNewest === null) {
        coercedNewest = coercedVersion;
      } else {
        if (coercedVersion && semver.gt(coercedVersion, coercedNewest)) {
          coercedNewest = version;
        }
      }
    }

    result[dep] = coercedNewest ? coercedNewest.toString() : fallbackVersion;
  }

  return result;
}

async function main() {
  try {
    const destPath: string = process.argv[2];
    const sourcesPaths: string[] = process.argv.slice(3);

    const scannedDependencies = scan(await Promise.all(sourcesPaths.map(async s => await readJSON(s))));
    const dependencies = map(scannedDependencies);
    const content = {...(await readJSON(destPath)), dependencies};
    const written = await writeJSON(destPath, content);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const result = main();
