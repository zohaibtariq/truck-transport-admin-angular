#!/usr/bin/env node

      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
import {
  main
} from "../../chunk-4WG4TJYY.js";
import "../../chunk-BUHWADBP.js";
import "../../chunk-DNR6BLSX.js";
import "../../chunk-A7GANIJT.js";
import "../../chunk-W3FLD7KU.js";
import {
  NodeJSFileSystem,
  setFileSystem
} from "../../chunk-HAJOG5B7.js";
import "../../chunk-LC26KH5A.js";
import {
  __require,
  __toESM
} from "../../chunk-GMSUYBZP.js";

// bazel-out/darwin-fastbuild/bin/packages/compiler-cli/src/bin/ngc.mjs
import "reflect-metadata";
async function runNgcComamnd() {
  process.title = "Angular Compiler (ngc)";
  const args = process.argv.slice(2);
  setFileSystem(new NodeJSFileSystem());
  let tsickleModule;
  try {
    tsickleModule = (await Promise.resolve().then(() => __toESM(__require("tsickle"), 1))).default;
  } catch {
  }
  process.exitCode = main(args, void 0, void 0, void 0, void 0, void 0, tsickleModule);
}
runNgcComamnd().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=ngc.js.map
