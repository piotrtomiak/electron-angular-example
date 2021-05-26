import commonjs from "@rollup/plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";

const pkg = require("./package.json");

const libraryName = "app-common";

export default {
  input: `src/index.ts`,
  output: [
    {file: pkg.main, name: libraryName, format: "umd", sourcemap: true, globals: {uuid: "uuid", lodash: "_"}},
    {file: pkg.module, format: "es", sourcemap: true, globals: {uuid: "uuid", lodash: "_"}},
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    "uuid",
    "lodash"
  ],
  watch: {
    include: "src/**",
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({useTsconfigDeclarationDir: true}),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
};
