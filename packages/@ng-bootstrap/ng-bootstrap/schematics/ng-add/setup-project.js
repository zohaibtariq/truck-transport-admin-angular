"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const add_bootstrap_1 = require("./steps/add-bootstrap");
const add_ngb_module_1 = require("./steps/add-ngb-module");
/**
 * Sets up a project with all required to run ng-bootstrap.
 * This is run after 'package.json' was patched and all dependencies installed
 */
function ngAddSetupProject(options) {
    return (0, schematics_1.chain)([
        (0, add_ngb_module_1.addNgbModuleToAppModule)(options),
        (0, add_bootstrap_1.addBootstrapStyles)(options),
        (0, schematics_1.externalSchematic)('@angular/localize', 'ng-add', options.project ? { name: options.project } : {}),
    ]);
}
exports.default = ngAddSetupProject;
//# sourceMappingURL=setup-project.js.map