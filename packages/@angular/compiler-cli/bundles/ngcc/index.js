
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
import {
  mainNgcc
} from "../chunk-OU6PTAY7.js";
import "../chunk-SJL5HBUW.js";
import {
  clearTsConfigCache
} from "../chunk-UETOBSA6.js";
import "../chunk-BUHWADBP.js";
import "../chunk-DNR6BLSX.js";
import "../chunk-A7GANIJT.js";
import {
  ConsoleLogger,
  LogLevel
} from "../chunk-ZCDB56AX.js";
import "../chunk-UTSZJQCU.js";
import "../chunk-W3FLD7KU.js";
import {
  NodeJSFileSystem,
  setFileSystem
} from "../chunk-HAJOG5B7.js";
import "../chunk-LC26KH5A.js";
import "../chunk-GMSUYBZP.js";

// bazel-out/darwin-fastbuild/bin/packages/compiler-cli/ngcc/index.mjs
import { dirname, join } from "path";
import { fileURLToPath } from "url";
function process(options) {
  setFileSystem(new NodeJSFileSystem());
  return mainNgcc(options);
}
var containingDirPath = typeof __dirname !== "undefined" ? __dirname : dirname(fileURLToPath(__ESM_IMPORT_META_URL__));
var ngccMainFilePath = join(containingDirPath, "./main-ngcc.js");
export {
  ConsoleLogger,
  LogLevel,
  clearTsConfigCache,
  containingDirPath,
  ngccMainFilePath,
  process
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=index.js.map
