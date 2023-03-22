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
import { HttpClientBackendService } from './http-client-backend-service';
import { InMemoryBackendConfig, InMemoryDbService } from './interfaces';
import * as i0 from "@angular/core";
// Internal - Creates the in-mem backend for the HttpClient module
// AoT requires factory to be exported
export function httpClientInMemBackendServiceFactory(dbService, options, xhrFactory) {
    return new HttpClientBackendService(dbService, options, xhrFactory);
}
export class HttpClientInMemoryWebApiModule {
    /**
     *  Redirect the Angular `HttpClient` XHR calls
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
     * HttpInMemoryWebApiModule.forRoot(dbCreator);
     * HttpInMemoryWebApiModule.forRoot(dbCreator, {useValue: {delay:600}});
     */
    static forRoot(dbCreator, options) {
        return {
            ngModule: HttpClientInMemoryWebApiModule,
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
        return HttpClientInMemoryWebApiModule.forRoot(dbCreator, options);
    }
}
HttpClientInMemoryWebApiModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.2", ngImport: i0, type: HttpClientInMemoryWebApiModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
HttpClientInMemoryWebApiModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.1.0-next.2", ngImport: i0, type: HttpClientInMemoryWebApiModule });
HttpClientInMemoryWebApiModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.1.0-next.2", ngImport: i0, type: HttpClientInMemoryWebApiModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.2", ngImport: i0, type: HttpClientInMemoryWebApiModule, decorators: [{
            type: NgModule
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1jbGllbnQtaW4tbWVtb3J5LXdlYi1hcGktbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbWlzYy9hbmd1bGFyLWluLW1lbW9yeS13ZWItYXBpL3NyYy9odHRwLWNsaWVudC1pbi1tZW1vcnktd2ViLWFwaS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRCxPQUFPLEVBQXNCLFFBQVEsRUFBTyxNQUFNLGVBQWUsQ0FBQztBQUVsRSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUN2RSxPQUFPLEVBQUMscUJBQXFCLEVBQTZCLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDOztBQUVqRyxrRUFBa0U7QUFDbEUsc0NBQXNDO0FBQ3RDLE1BQU0sVUFBVSxvQ0FBb0MsQ0FDaEQsU0FBNEIsRUFBRSxPQUE4QixFQUM1RCxVQUFzQjtJQUN4QixPQUFPLElBQUksd0JBQXdCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQWdCLENBQUM7QUFDckYsQ0FBQztBQUdELE1BQU0sT0FBTyw4QkFBOEI7SUFDekM7Ozs7Ozs7Ozs7Ozs7OztPQWVHO0lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFrQyxFQUFFLE9BQW1DO1FBRXBGLE9BQU87WUFDTCxRQUFRLEVBQUUsOEJBQThCO1lBQ3hDLFNBQVMsRUFBRTtnQkFDVCxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDO2dCQUNqRCxFQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLEVBQUU7b0JBQ25ELE9BQU8sRUFBRSxXQUFXO29CQUNwQixVQUFVLEVBQUUsb0NBQW9DO29CQUNoRCxJQUFJLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxxQkFBcUIsRUFBRSxVQUFVLENBQUM7aUJBQzdEO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUNEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFrQyxFQUFFLE9BQW1DO1FBRXZGLE9BQU8sOEJBQThCLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRSxDQUFDOztzSUF4Q1UsOEJBQThCO3VJQUE5Qiw4QkFBOEI7dUlBQTlCLDhCQUE4QjtzR0FBOUIsOEJBQThCO2tCQUQxQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7WGhyRmFjdG9yeX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7SHR0cEJhY2tlbmR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIFR5cGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0h0dHBDbGllbnRCYWNrZW5kU2VydmljZX0gZnJvbSAnLi9odHRwLWNsaWVudC1iYWNrZW5kLXNlcnZpY2UnO1xuaW1wb3J0IHtJbk1lbW9yeUJhY2tlbmRDb25maWcsIEluTWVtb3J5QmFja2VuZENvbmZpZ0FyZ3MsIEluTWVtb3J5RGJTZXJ2aWNlfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG4vLyBJbnRlcm5hbCAtIENyZWF0ZXMgdGhlIGluLW1lbSBiYWNrZW5kIGZvciB0aGUgSHR0cENsaWVudCBtb2R1bGVcbi8vIEFvVCByZXF1aXJlcyBmYWN0b3J5IHRvIGJlIGV4cG9ydGVkXG5leHBvcnQgZnVuY3Rpb24gaHR0cENsaWVudEluTWVtQmFja2VuZFNlcnZpY2VGYWN0b3J5KFxuICAgIGRiU2VydmljZTogSW5NZW1vcnlEYlNlcnZpY2UsIG9wdGlvbnM6IEluTWVtb3J5QmFja2VuZENvbmZpZyxcbiAgICB4aHJGYWN0b3J5OiBYaHJGYWN0b3J5KTogSHR0cEJhY2tlbmQge1xuICByZXR1cm4gbmV3IEh0dHBDbGllbnRCYWNrZW5kU2VydmljZShkYlNlcnZpY2UsIG9wdGlvbnMsIHhockZhY3RvcnkpIGFzIEh0dHBCYWNrZW5kO1xufVxuXG5ATmdNb2R1bGUoKVxuZXhwb3J0IGNsYXNzIEh0dHBDbGllbnRJbk1lbW9yeVdlYkFwaU1vZHVsZSB7XG4gIC8qKlxuICAgKiAgUmVkaXJlY3QgdGhlIEFuZ3VsYXIgYEh0dHBDbGllbnRgIFhIUiBjYWxsc1xuICAgKiAgdG8gaW4tbWVtb3J5IGRhdGEgc3RvcmUgdGhhdCBpbXBsZW1lbnRzIGBJbk1lbW9yeURiU2VydmljZWAuXG4gICAqICB3aXRoIGNsYXNzIHRoYXQgaW1wbGVtZW50cyBJbk1lbW9yeURiU2VydmljZSBhbmQgY3JlYXRlcyBhbiBpbi1tZW1vcnkgZGF0YWJhc2UuXG4gICAqXG4gICAqICBVc3VhbGx5IGltcG9ydGVkIGluIHRoZSByb290IGFwcGxpY2F0aW9uIG1vZHVsZS5cbiAgICogIENhbiBpbXBvcnQgaW4gYSBsYXp5IGZlYXR1cmUgbW9kdWxlIHRvbywgd2hpY2ggd2lsbCBzaGFkb3cgbW9kdWxlcyBsb2FkZWQgZWFybGllclxuICAgKlxuICAgKiBAcGFyYW0gZGJDcmVhdG9yIC0gQ2xhc3MgdGhhdCBjcmVhdGVzIHNlZWQgZGF0YSBmb3IgaW4tbWVtb3J5IGRhdGFiYXNlLiBNdXN0IGltcGxlbWVudFxuICAgKiAgICAgSW5NZW1vcnlEYlNlcnZpY2UuXG4gICAqIEBwYXJhbSBbb3B0aW9uc11cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogSHR0cEluTWVtb3J5V2ViQXBpTW9kdWxlLmZvclJvb3QoZGJDcmVhdG9yKTtcbiAgICogSHR0cEluTWVtb3J5V2ViQXBpTW9kdWxlLmZvclJvb3QoZGJDcmVhdG9yLCB7dXNlVmFsdWU6IHtkZWxheTo2MDB9fSk7XG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdChkYkNyZWF0b3I6IFR5cGU8SW5NZW1vcnlEYlNlcnZpY2U+LCBvcHRpb25zPzogSW5NZW1vcnlCYWNrZW5kQ29uZmlnQXJncyk6XG4gICAgICBNb2R1bGVXaXRoUHJvdmlkZXJzPEh0dHBDbGllbnRJbk1lbW9yeVdlYkFwaU1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogSHR0cENsaWVudEluTWVtb3J5V2ViQXBpTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBJbk1lbW9yeURiU2VydmljZSwgdXNlQ2xhc3M6IGRiQ3JlYXRvcn0sXG4gICAgICAgIHtwcm92aWRlOiBJbk1lbW9yeUJhY2tlbmRDb25maWcsIHVzZVZhbHVlOiBvcHRpb25zfSwge1xuICAgICAgICAgIHByb3ZpZGU6IEh0dHBCYWNrZW5kLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGh0dHBDbGllbnRJbk1lbUJhY2tlbmRTZXJ2aWNlRmFjdG9yeSxcbiAgICAgICAgICBkZXBzOiBbSW5NZW1vcnlEYlNlcnZpY2UsIEluTWVtb3J5QmFja2VuZENvbmZpZywgWGhyRmFjdG9yeV1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbiAgLyoqXG4gICAqXG4gICAqIEVuYWJsZSBhbmQgY29uZmlndXJlIHRoZSBpbi1tZW1vcnkgd2ViIGFwaSBpbiBhIGxhenktbG9hZGVkIGZlYXR1cmUgbW9kdWxlLlxuICAgKiBTYW1lIGFzIGBmb3JSb290YC5cbiAgICogVGhpcyBpcyBhIGZlZWwtZ29vZCBtZXRob2Qgc28geW91IGNhbiBmb2xsb3cgdGhlIEFuZ3VsYXIgc3R5bGUgZ3VpZGUgZm9yIGxhenktbG9hZGVkIG1vZHVsZXMuXG4gICAqL1xuICBzdGF0aWMgZm9yRmVhdHVyZShkYkNyZWF0b3I6IFR5cGU8SW5NZW1vcnlEYlNlcnZpY2U+LCBvcHRpb25zPzogSW5NZW1vcnlCYWNrZW5kQ29uZmlnQXJncyk6XG4gICAgICBNb2R1bGVXaXRoUHJvdmlkZXJzPEh0dHBDbGllbnRJbk1lbW9yeVdlYkFwaU1vZHVsZT4ge1xuICAgIHJldHVybiBIdHRwQ2xpZW50SW5NZW1vcnlXZWJBcGlNb2R1bGUuZm9yUm9vdChkYkNyZWF0b3IsIG9wdGlvbnMpO1xuICB9XG59XG4iXX0=