#!/usr/bin/env node

      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
import {
  parseCommandLineOptions
} from "../chunk-UDG7FV2F.js";
import {
  mainNgcc
} from "../chunk-OU6PTAY7.js";
import "../chunk-SJL5HBUW.js";
import "../chunk-UETOBSA6.js";
import "../chunk-BUHWADBP.js";
import "../chunk-DNR6BLSX.js";
import "../chunk-A7GANIJT.js";
import "../chunk-ZCDB56AX.js";
import "../chunk-UTSZJQCU.js";
import "../chunk-W3FLD7KU.js";
import "../chunk-HAJOG5B7.js";
import "../chunk-LC26KH5A.js";
import "../chunk-GMSUYBZP.js";

// bazel-out/darwin-fastbuild/bin/packages/compiler-cli/ngcc/main-ngcc.mjs
process.title = "ngcc";
var startTime = Date.now();
var options = parseCommandLineOptions(process.argv.slice(2));
(async () => {
  try {
    await mainNgcc(options);
    if (options.logger) {
      const duration = Math.round((Date.now() - startTime) / 1e3);
      options.logger.debug(`Run ngcc in ${duration}s.`);
    }
    process.exitCode = 0;
  } catch (e) {
    console.error(e.stack || e.message);
    process.exit(typeof e.code === "number" ? e.code : 1);
  }
})();
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=main-ngcc.js.map
