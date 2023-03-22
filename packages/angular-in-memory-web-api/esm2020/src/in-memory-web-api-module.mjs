/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { XhrFactory } from '@angular/common';
import { HttpBackend } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { httpClientInMemBackendServiceFactory } from './http-client-in-memory-web-api-module';
import { InMemoryBackendConfig, InMemoryDbService } from './interfaces';
import * as i0 from "@angular/core";
export class InMemoryWebApiModule {
    /**
     *  Redirect BOTH Angular `Http` and `HttpClient` XHR calls
     *  to in-memory data store that implements `InMemoryDbService`.
     *  with class that implements InMemoryDbService and creates an in-memory database.
     *
     *  Usually imported in the root application module.
     *  Can import in a lazy feature module too, which will shadow modules loaded earlier
     *
     * @param dbCreator - Class that creates seed data for in-memory database. Must implement
     *     InMemoryDbService.
     * @param [options]
     *
     * @example
     * InMemoryWebApiModule.forRoot(dbCreator);
     * InMemoryWebApiModule.forRoot(dbCreator, {useValue: {delay:600}});
     */
    static forRoot(dbCreator, options) {
        return {
            ngModule: InMemoryWebApiModule,
            providers: [
                { provide: InMemoryDbService, useClass: dbCreator },
                { provide: InMemoryBackendConfig, useValue: options }, {
                    provide: HttpBackend,
                    useFactory: httpClientInMemBackendServiceFactory,
                    deps: [InMemoryDbService, InMemoryBackendConfig, XhrFactory]
                }
            ]
        };
    }
    /**
     *
     * Enable and configure the in-memory web api in a lazy-loaded feature module.
     * Same as `forRoot`.
     * This is a feel-good method so you can follow the Angular style guide for lazy-loaded modules.
     */
    static forFeature(dbCreator, options) {
        return InMemoryWebApiModule.forRoot(dbCreator, options);
    }
}
InMemoryWebApiModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.2", ngImport: i0, type: InMemoryWebApiModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
InMemoryWebApiModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.1.0-next.2", ngImport: i0, type: InMemoryWebApiModule });
InMemoryWebApiModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.1.0-next.2", ngImport: i0, type: InMemoryWebApiModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.2", ngImport: i0, type: InMemoryWebApiModule, decorators: [{
            type: NgModule
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW4tbWVtb3J5LXdlYi1hcGktbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbWlzYy9hbmd1bGFyLWluLW1lbW9yeS13ZWItYXBpL3NyYy9pbi1tZW1vcnktd2ViLWFwaS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRCxPQUFPLEVBQXNCLFFBQVEsRUFBTyxNQUFNLGVBQWUsQ0FBQztBQUVsRSxPQUFPLEVBQUMsb0NBQW9DLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUM1RixPQUFPLEVBQUMscUJBQXFCLEVBQTZCLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDOztBQUdqRyxNQUFNLE9BQU8sb0JBQW9CO0lBQy9COzs7Ozs7Ozs7Ozs7Ozs7T0FlRztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBa0MsRUFBRSxPQUFtQztRQUVwRixPQUFPO1lBQ0wsUUFBUSxFQUFFLG9CQUFvQjtZQUM5QixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBQztnQkFDakQsRUFBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQyxFQUFFO29CQUNuRCxPQUFPLEVBQUUsV0FBVztvQkFDcEIsVUFBVSxFQUFFLG9DQUFvQztvQkFDaEQsSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUUscUJBQXFCLEVBQUUsVUFBVSxDQUFDO2lCQUM3RDthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBa0MsRUFBRSxPQUFtQztRQUV2RixPQUFPLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQzs7NEhBekNVLG9CQUFvQjs2SEFBcEIsb0JBQW9COzZIQUFwQixvQkFBb0I7c0dBQXBCLG9CQUFvQjtrQkFEaEMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1hockZhY3Rvcnl9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0h0dHBCYWNrZW5kfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBUeXBlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtodHRwQ2xpZW50SW5NZW1CYWNrZW5kU2VydmljZUZhY3Rvcnl9IGZyb20gJy4vaHR0cC1jbGllbnQtaW4tbWVtb3J5LXdlYi1hcGktbW9kdWxlJztcbmltcG9ydCB7SW5NZW1vcnlCYWNrZW5kQ29uZmlnLCBJbk1lbW9yeUJhY2tlbmRDb25maWdBcmdzLCBJbk1lbW9yeURiU2VydmljZX0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuQE5nTW9kdWxlKClcbmV4cG9ydCBjbGFzcyBJbk1lbW9yeVdlYkFwaU1vZHVsZSB7XG4gIC8qKlxuICAgKiAgUmVkaXJlY3QgQk9USCBBbmd1bGFyIGBIdHRwYCBhbmQgYEh0dHBDbGllbnRgIFhIUiBjYWxsc1xuICAgKiAgdG8gaW4tbWVtb3J5IGRhdGEgc3RvcmUgdGhhdCBpbXBsZW1lbnRzIGBJbk1lbW9yeURiU2VydmljZWAuXG4gICAqICB3aXRoIGNsYXNzIHRoYXQgaW1wbGVtZW50cyBJbk1lbW9yeURiU2VydmljZSBhbmQgY3JlYXRlcyBhbiBpbi1tZW1vcnkgZGF0YWJhc2UuXG4gICAqXG4gICAqICBVc3VhbGx5IGltcG9ydGVkIGluIHRoZSByb290IGFwcGxpY2F0aW9uIG1vZHVsZS5cbiAgICogIENhbiBpbXBvcnQgaW4gYSBsYXp5IGZlYXR1cmUgbW9kdWxlIHRvbywgd2hpY2ggd2lsbCBzaGFkb3cgbW9kdWxlcyBsb2FkZWQgZWFybGllclxuICAgKlxuICAgKiBAcGFyYW0gZGJDcmVhdG9yIC0gQ2xhc3MgdGhhdCBjcmVhdGVzIHNlZWQgZGF0YSBmb3IgaW4tbWVtb3J5IGRhdGFiYXNlLiBNdXN0IGltcGxlbWVudFxuICAgKiAgICAgSW5NZW1vcnlEYlNlcnZpY2UuXG4gICAqIEBwYXJhbSBbb3B0aW9uc11cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogSW5NZW1vcnlXZWJBcGlNb2R1bGUuZm9yUm9vdChkYkNyZWF0b3IpO1xuICAgKiBJbk1lbW9yeVdlYkFwaU1vZHVsZS5mb3JSb290KGRiQ3JlYXRvciwge3VzZVZhbHVlOiB7ZGVsYXk6NjAwfX0pO1xuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoZGJDcmVhdG9yOiBUeXBlPEluTWVtb3J5RGJTZXJ2aWNlPiwgb3B0aW9ucz86IEluTWVtb3J5QmFja2VuZENvbmZpZ0FyZ3MpOlxuICAgICAgTW9kdWxlV2l0aFByb3ZpZGVyczxJbk1lbW9yeVdlYkFwaU1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogSW5NZW1vcnlXZWJBcGlNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IEluTWVtb3J5RGJTZXJ2aWNlLCB1c2VDbGFzczogZGJDcmVhdG9yfSxcbiAgICAgICAge3Byb3ZpZGU6IEluTWVtb3J5QmFja2VuZENvbmZpZywgdXNlVmFsdWU6IG9wdGlvbnN9LCB7XG4gICAgICAgICAgcHJvdmlkZTogSHR0cEJhY2tlbmQsXG4gICAgICAgICAgdXNlRmFjdG9yeTogaHR0cENsaWVudEluTWVtQmFja2VuZFNlcnZpY2VGYWN0b3J5LFxuICAgICAgICAgIGRlcHM6IFtJbk1lbW9yeURiU2VydmljZSwgSW5NZW1vcnlCYWNrZW5kQ29uZmlnLCBYaHJGYWN0b3J5XVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBFbmFibGUgYW5kIGNvbmZpZ3VyZSB0aGUgaW4tbWVtb3J5IHdlYiBhcGkgaW4gYSBsYXp5LWxvYWRlZCBmZWF0dXJlIG1vZHVsZS5cbiAgICogU2FtZSBhcyBgZm9yUm9vdGAuXG4gICAqIFRoaXMgaXMgYSBmZWVsLWdvb2QgbWV0aG9kIHNvIHlvdSBjYW4gZm9sbG93IHRoZSBBbmd1bGFyIHN0eWxlIGd1aWRlIGZvciBsYXp5LWxvYWRlZCBtb2R1bGVzLlxuICAgKi9cbiAgc3RhdGljIGZvckZlYXR1cmUoZGJDcmVhdG9yOiBUeXBlPEluTWVtb3J5RGJTZXJ2aWNlPiwgb3B0aW9ucz86IEluTWVtb3J5QmFja2VuZENvbmZpZ0FyZ3MpOlxuICAgICAgTW9kdWxlV2l0aFByb3ZpZGVyczxJbk1lbW9yeVdlYkFwaU1vZHVsZT4ge1xuICAgIHJldHVybiBJbk1lbW9yeVdlYkFwaU1vZHVsZS5mb3JSb290KGRiQ3JlYXRvciwgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==