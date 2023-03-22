import type { Tree } from '@nrwl/tao/src/shared/tree';
import type { PackageManager } from '@nrwl/tao/src/shared/package-manager';
/**
 * Runs `npm install` or `yarn install`. It will skip running the install if
 * `package.json` hasn't changed at all or it hasn't changed since the last invocation.
 *
 * @param tree - the file system tree
 * @param alwaysRun - always run the command even if `package.json` hasn't changed.
 */
export declare function installPackagesTask(tree: Tree, alwaysRun?: boolean, cwd?: string, packageManager?: PackageManager): void;
