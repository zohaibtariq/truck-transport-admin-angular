"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToV13 = exports.updateToV12 = exports.updateToV11 = exports.updateToV10 = exports.updateToV9 = exports.updateToV8 = exports.updateToV7 = exports.updateToV6 = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const hammer_gestures_migration_1 = require("./migrations/hammer-gestures-v9/hammer-gestures-migration");
const misc_class_inheritance_1 = require("./migrations/misc-checks/misc-class-inheritance");
const misc_class_names_1 = require("./migrations/misc-checks/misc-class-names");
const misc_imports_1 = require("./migrations/misc-checks/misc-imports");
const misc_property_names_1 = require("./migrations/misc-checks/misc-property-names");
const misc_template_1 = require("./migrations/misc-checks/misc-template");
const ripple_speed_factor_migration_1 = require("./migrations/misc-ripples-v7/ripple-speed-factor-migration");
const secondary_entry_points_migration_1 = require("./migrations/package-imports-v8/secondary-entry-points-migration");
const theming_api_migration_1 = require("./migrations/theming-api-v12/theming-api-migration");
const upgrade_data_1 = require("./upgrade-data");
const materialMigrations = [
    misc_class_inheritance_1.MiscClassInheritanceMigration,
    misc_class_names_1.MiscClassNamesMigration,
    misc_imports_1.MiscImportsMigration,
    misc_property_names_1.MiscPropertyNamesMigration,
    misc_template_1.MiscTemplateMigration,
    ripple_speed_factor_migration_1.RippleSpeedFactorMigration,
    secondary_entry_points_migration_1.SecondaryEntryPointsMigration,
    hammer_gestures_migration_1.HammerGesturesMigration,
    theming_api_migration_1.ThemingApiMigration,
];
/** Entry point for the migration schematics with target of Angular Material v6 */
function updateToV6() {
    return (0, schematics_1.createMigrationSchematicRule)(schematics_1.TargetVersion.V6, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV6 = updateToV6;
/** Entry point for the migration schematics with target of Angular Material v7 */
function updateToV7() {
    return (0, schematics_1.createMigrationSchematicRule)(schematics_1.TargetVersion.V7, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV7 = updateToV7;
/** Entry point for the migration schematics with target of Angular Material v8 */
function updateToV8() {
    return (0, schematics_1.createMigrationSchematicRule)(schematics_1.TargetVersion.V8, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV8 = updateToV8;
/** Entry point for the migration schematics with target of Angular Material v9 */
function updateToV9() {
    return (0, schematics_1.createMigrationSchematicRule)(schematics_1.TargetVersion.V9, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV9 = updateToV9;
/** Entry point for the migration schematics with target of Angular Material v10 */
function updateToV10() {
    return (0, schematics_1.createMigrationSchematicRule)(schematics_1.TargetVersion.V10, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV10 = updateToV10;
/** Entry point for the migration schematics with target of Angular Material v11 */
function updateToV11() {
    return (0, schematics_1.createMigrationSchematicRule)(schematics_1.TargetVersion.V11, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV11 = updateToV11;
/** Entry point for the migration schematics with target of Angular Material v12 */
function updateToV12() {
    return (0, schematics_1.createMigrationSchematicRule)(schematics_1.TargetVersion.V12, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV12 = updateToV12;
/** Entry point for the migration schematics with target of Angular Material v13 */
function updateToV13() {
    return (0, schematics_1.createMigrationSchematicRule)(schematics_1.TargetVersion.V13, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV13 = updateToV13;
/** Function that will be called when the migration completed. */
function onMigrationComplete(context, targetVersion, hasFailures) {
    context.logger.info('');
    context.logger.info(`  ✓  Updated Angular Material to ${targetVersion}`);
    context.logger.info('');
    if (hasFailures) {
        context.logger.warn('  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
            'output above and fix these issues manually.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsd0RBSWlDO0FBQ2pDLHlHQUFrRztBQUNsRyw0RkFBOEY7QUFDOUYsZ0ZBQWtGO0FBQ2xGLHdFQUEyRTtBQUMzRSxzRkFBd0Y7QUFDeEYsMEVBQTZFO0FBQzdFLDhHQUFzRztBQUN0Ryx1SEFBK0c7QUFDL0csOEZBQXVGO0FBRXZGLGlEQUFtRDtBQUVuRCxNQUFNLGtCQUFrQixHQUE4QjtJQUNwRCxzREFBNkI7SUFDN0IsMENBQXVCO0lBQ3ZCLG1DQUFvQjtJQUNwQixnREFBMEI7SUFDMUIscUNBQXFCO0lBQ3JCLDBEQUEwQjtJQUMxQixnRUFBNkI7SUFDN0IsbURBQXVCO0lBQ3ZCLDJDQUFtQjtDQUNwQixDQUFDO0FBRUYsa0ZBQWtGO0FBQ2xGLFNBQWdCLFVBQVU7SUFDeEIsT0FBTyxJQUFBLHlDQUE0QixFQUNqQywwQkFBYSxDQUFDLEVBQUUsRUFDaEIsa0JBQWtCLEVBQ2xCLGtDQUFtQixFQUNuQixtQkFBbUIsQ0FDcEIsQ0FBQztBQUNKLENBQUM7QUFQRCxnQ0FPQztBQUVELGtGQUFrRjtBQUNsRixTQUFnQixVQUFVO0lBQ3hCLE9BQU8sSUFBQSx5Q0FBNEIsRUFDakMsMEJBQWEsQ0FBQyxFQUFFLEVBQ2hCLGtCQUFrQixFQUNsQixrQ0FBbUIsRUFDbkIsbUJBQW1CLENBQ3BCLENBQUM7QUFDSixDQUFDO0FBUEQsZ0NBT0M7QUFFRCxrRkFBa0Y7QUFDbEYsU0FBZ0IsVUFBVTtJQUN4QixPQUFPLElBQUEseUNBQTRCLEVBQ2pDLDBCQUFhLENBQUMsRUFBRSxFQUNoQixrQkFBa0IsRUFDbEIsa0NBQW1CLEVBQ25CLG1CQUFtQixDQUNwQixDQUFDO0FBQ0osQ0FBQztBQVBELGdDQU9DO0FBRUQsa0ZBQWtGO0FBQ2xGLFNBQWdCLFVBQVU7SUFDeEIsT0FBTyxJQUFBLHlDQUE0QixFQUNqQywwQkFBYSxDQUFDLEVBQUUsRUFDaEIsa0JBQWtCLEVBQ2xCLGtDQUFtQixFQUNuQixtQkFBbUIsQ0FDcEIsQ0FBQztBQUNKLENBQUM7QUFQRCxnQ0FPQztBQUVELG1GQUFtRjtBQUNuRixTQUFnQixXQUFXO0lBQ3pCLE9BQU8sSUFBQSx5Q0FBNEIsRUFDakMsMEJBQWEsQ0FBQyxHQUFHLEVBQ2pCLGtCQUFrQixFQUNsQixrQ0FBbUIsRUFDbkIsbUJBQW1CLENBQ3BCLENBQUM7QUFDSixDQUFDO0FBUEQsa0NBT0M7QUFFRCxtRkFBbUY7QUFDbkYsU0FBZ0IsV0FBVztJQUN6QixPQUFPLElBQUEseUNBQTRCLEVBQ2pDLDBCQUFhLENBQUMsR0FBRyxFQUNqQixrQkFBa0IsRUFDbEIsa0NBQW1CLEVBQ25CLG1CQUFtQixDQUNwQixDQUFDO0FBQ0osQ0FBQztBQVBELGtDQU9DO0FBRUQsbUZBQW1GO0FBQ25GLFNBQWdCLFdBQVc7SUFDekIsT0FBTyxJQUFBLHlDQUE0QixFQUNqQywwQkFBYSxDQUFDLEdBQUcsRUFDakIsa0JBQWtCLEVBQ2xCLGtDQUFtQixFQUNuQixtQkFBbUIsQ0FDcEIsQ0FBQztBQUNKLENBQUM7QUFQRCxrQ0FPQztBQUVELG1GQUFtRjtBQUNuRixTQUFnQixXQUFXO0lBQ3pCLE9BQU8sSUFBQSx5Q0FBNEIsRUFDakMsMEJBQWEsQ0FBQyxHQUFHLEVBQ2pCLGtCQUFrQixFQUNsQixrQ0FBbUIsRUFDbkIsbUJBQW1CLENBQ3BCLENBQUM7QUFDSixDQUFDO0FBUEQsa0NBT0M7QUFFRCxpRUFBaUU7QUFDakUsU0FBUyxtQkFBbUIsQ0FDMUIsT0FBeUIsRUFDekIsYUFBNEIsRUFDNUIsV0FBb0I7SUFFcEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDekUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFeEIsSUFBSSxXQUFXLEVBQUU7UUFDZixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDakIsd0ZBQXdGO1lBQ3RGLDZDQUE2QyxDQUNoRCxDQUFDO0tBQ0g7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UnVsZSwgU2NoZW1hdGljQ29udGV4dH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgY3JlYXRlTWlncmF0aW9uU2NoZW1hdGljUnVsZSxcbiAgTnVsbGFibGVEZXZraXRNaWdyYXRpb24sXG4gIFRhcmdldFZlcnNpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7SGFtbWVyR2VzdHVyZXNNaWdyYXRpb259IGZyb20gJy4vbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvaGFtbWVyLWdlc3R1cmVzLW1pZ3JhdGlvbic7XG5pbXBvcnQge01pc2NDbGFzc0luaGVyaXRhbmNlTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy1jbGFzcy1pbmhlcml0YW5jZSc7XG5pbXBvcnQge01pc2NDbGFzc05hbWVzTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy1jbGFzcy1uYW1lcyc7XG5pbXBvcnQge01pc2NJbXBvcnRzTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy1pbXBvcnRzJztcbmltcG9ydCB7TWlzY1Byb3BlcnR5TmFtZXNNaWdyYXRpb259IGZyb20gJy4vbWlncmF0aW9ucy9taXNjLWNoZWNrcy9taXNjLXByb3BlcnR5LW5hbWVzJztcbmltcG9ydCB7TWlzY1RlbXBsYXRlTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy10ZW1wbGF0ZSc7XG5pbXBvcnQge1JpcHBsZVNwZWVkRmFjdG9yTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1yaXBwbGVzLXY3L3JpcHBsZS1zcGVlZC1mYWN0b3ItbWlncmF0aW9uJztcbmltcG9ydCB7U2Vjb25kYXJ5RW50cnlQb2ludHNNaWdyYXRpb259IGZyb20gJy4vbWlncmF0aW9ucy9wYWNrYWdlLWltcG9ydHMtdjgvc2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24nO1xuaW1wb3J0IHtUaGVtaW5nQXBpTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL3RoZW1pbmctYXBpLW1pZ3JhdGlvbic7XG5cbmltcG9ydCB7bWF0ZXJpYWxVcGdyYWRlRGF0YX0gZnJvbSAnLi91cGdyYWRlLWRhdGEnO1xuXG5jb25zdCBtYXRlcmlhbE1pZ3JhdGlvbnM6IE51bGxhYmxlRGV2a2l0TWlncmF0aW9uW10gPSBbXG4gIE1pc2NDbGFzc0luaGVyaXRhbmNlTWlncmF0aW9uLFxuICBNaXNjQ2xhc3NOYW1lc01pZ3JhdGlvbixcbiAgTWlzY0ltcG9ydHNNaWdyYXRpb24sXG4gIE1pc2NQcm9wZXJ0eU5hbWVzTWlncmF0aW9uLFxuICBNaXNjVGVtcGxhdGVNaWdyYXRpb24sXG4gIFJpcHBsZVNwZWVkRmFjdG9yTWlncmF0aW9uLFxuICBTZWNvbmRhcnlFbnRyeVBvaW50c01pZ3JhdGlvbixcbiAgSGFtbWVyR2VzdHVyZXNNaWdyYXRpb24sXG4gIFRoZW1pbmdBcGlNaWdyYXRpb24sXG5dO1xuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHY2ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WNigpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgVGFyZ2V0VmVyc2lvbi5WNixcbiAgICBtYXRlcmlhbE1pZ3JhdGlvbnMsXG4gICAgbWF0ZXJpYWxVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHY3ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WNygpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgVGFyZ2V0VmVyc2lvbi5WNyxcbiAgICBtYXRlcmlhbE1pZ3JhdGlvbnMsXG4gICAgbWF0ZXJpYWxVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHY4ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WOCgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgVGFyZ2V0VmVyc2lvbi5WOCxcbiAgICBtYXRlcmlhbE1pZ3JhdGlvbnMsXG4gICAgbWF0ZXJpYWxVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHY5ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WOSgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgVGFyZ2V0VmVyc2lvbi5WOSxcbiAgICBtYXRlcmlhbE1pZ3JhdGlvbnMsXG4gICAgbWF0ZXJpYWxVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHYxMCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjEwKCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlTWlncmF0aW9uU2NoZW1hdGljUnVsZShcbiAgICBUYXJnZXRWZXJzaW9uLlYxMCxcbiAgICBtYXRlcmlhbE1pZ3JhdGlvbnMsXG4gICAgbWF0ZXJpYWxVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHYxMSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjExKCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlTWlncmF0aW9uU2NoZW1hdGljUnVsZShcbiAgICBUYXJnZXRWZXJzaW9uLlYxMSxcbiAgICBtYXRlcmlhbE1pZ3JhdGlvbnMsXG4gICAgbWF0ZXJpYWxVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHYxMiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjEyKCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlTWlncmF0aW9uU2NoZW1hdGljUnVsZShcbiAgICBUYXJnZXRWZXJzaW9uLlYxMixcbiAgICBtYXRlcmlhbE1pZ3JhdGlvbnMsXG4gICAgbWF0ZXJpYWxVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHYxMyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjEzKCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlTWlncmF0aW9uU2NoZW1hdGljUnVsZShcbiAgICBUYXJnZXRWZXJzaW9uLlYxMyxcbiAgICBtYXRlcmlhbE1pZ3JhdGlvbnMsXG4gICAgbWF0ZXJpYWxVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBtaWdyYXRpb24gY29tcGxldGVkLiAqL1xuZnVuY3Rpb24gb25NaWdyYXRpb25Db21wbGV0ZShcbiAgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCxcbiAgdGFyZ2V0VmVyc2lvbjogVGFyZ2V0VmVyc2lvbixcbiAgaGFzRmFpbHVyZXM6IGJvb2xlYW4sXG4pIHtcbiAgY29udGV4dC5sb2dnZXIuaW5mbygnJyk7XG4gIGNvbnRleHQubG9nZ2VyLmluZm8oYCAg4pyTICBVcGRhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgdG8gJHt0YXJnZXRWZXJzaW9ufWApO1xuICBjb250ZXh0LmxvZ2dlci5pbmZvKCcnKTtcblxuICBpZiAoaGFzRmFpbHVyZXMpIHtcbiAgICBjb250ZXh0LmxvZ2dlci53YXJuKFxuICAgICAgJyAg4pqgICBTb21lIGlzc3VlcyB3ZXJlIGRldGVjdGVkIGJ1dCBjb3VsZCBub3QgYmUgZml4ZWQgYXV0b21hdGljYWxseS4gUGxlYXNlIGNoZWNrIHRoZSAnICtcbiAgICAgICAgJ291dHB1dCBhYm92ZSBhbmQgZml4IHRoZXNlIGlzc3VlcyBtYW51YWxseS4nLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==