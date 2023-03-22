import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Toast } from './toast.component';
import { DefaultNoComponentGlobalConfig, TOAST_CONFIG, } from './toastr-config';
import * as i0 from "@angular/core";
export const DefaultGlobalConfig = {
    ...DefaultNoComponentGlobalConfig,
    toastComponent: Toast,
};
export class ToastrModule {
    static forRoot(config = {}) {
        return {
            ngModule: ToastrModule,
            providers: [
                {
                    provide: TOAST_CONFIG,
                    useValue: {
                        default: DefaultGlobalConfig,
                        config,
                    },
                },
            ],
        };
    }
}
ToastrModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: ToastrModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ToastrModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: ToastrModule, declarations: [Toast], imports: [CommonModule], exports: [Toast] });
ToastrModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: ToastrModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: ToastrModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [Toast],
                    exports: [Toast],
                    entryComponents: [Toast],
                }]
        }] });
export class ToastrComponentlessModule {
    static forRoot(config = {}) {
        return {
            ngModule: ToastrModule,
            providers: [
                {
                    provide: TOAST_CONFIG,
                    useValue: {
                        default: DefaultNoComponentGlobalConfig,
                        config,
                    },
                },
            ],
        };
    }
}
ToastrComponentlessModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: ToastrComponentlessModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ToastrComponentlessModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: ToastrComponentlessModule, imports: [CommonModule] });
ToastrComponentlessModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: ToastrComponentlessModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: ToastrComponentlessModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3RyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdG9hc3RyL3RvYXN0ci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQ0wsOEJBQThCLEVBRTlCLFlBQVksR0FDYixNQUFNLGlCQUFpQixDQUFDOztBQUV6QixNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBaUI7SUFDL0MsR0FBRyw4QkFBOEI7SUFDakMsY0FBYyxFQUFFLEtBQUs7Q0FDdEIsQ0FBQztBQVFGLE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBZ0MsRUFBRTtRQUMvQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLFlBQVk7WUFDdEIsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE9BQU8sRUFBRSxZQUFZO29CQUNyQixRQUFRLEVBQUU7d0JBQ1IsT0FBTyxFQUFFLG1CQUFtQjt3QkFDNUIsTUFBTTtxQkFDUDtpQkFDRjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7O3lHQWRVLFlBQVk7MEdBQVosWUFBWSxpQkFKUixLQUFLLGFBRFYsWUFBWSxhQUVaLEtBQUs7MEdBR0osWUFBWSxZQUxkLENBQUMsWUFBWSxDQUFDOzJGQUtaLFlBQVk7a0JBTnhCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUM7b0JBQ3JCLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQztvQkFDaEIsZUFBZSxFQUFFLENBQUMsS0FBSyxDQUFDO2lCQUN6Qjs7QUFxQkQsTUFBTSxPQUFPLHlCQUF5QjtJQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQWdDLEVBQUU7UUFDL0MsT0FBTztZQUNMLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsWUFBWTtvQkFDckIsUUFBUSxFQUFFO3dCQUNSLE9BQU8sRUFBRSw4QkFBOEI7d0JBQ3ZDLE1BQU07cUJBQ1A7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOztzSEFkVSx5QkFBeUI7dUhBQXpCLHlCQUF5QixZQUYxQixZQUFZO3VIQUVYLHlCQUF5QixZQUYzQixDQUFDLFlBQVksQ0FBQzsyRkFFWix5QkFBeUI7a0JBSHJDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUN4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBUb2FzdCB9IGZyb20gJy4vdG9hc3QuY29tcG9uZW50JztcbmltcG9ydCB7XG4gIERlZmF1bHROb0NvbXBvbmVudEdsb2JhbENvbmZpZyxcbiAgR2xvYmFsQ29uZmlnLFxuICBUT0FTVF9DT05GSUcsXG59IGZyb20gJy4vdG9hc3RyLWNvbmZpZyc7XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0R2xvYmFsQ29uZmlnOiBHbG9iYWxDb25maWcgPSB7XG4gIC4uLkRlZmF1bHROb0NvbXBvbmVudEdsb2JhbENvbmZpZyxcbiAgdG9hc3RDb21wb25lbnQ6IFRvYXN0LFxufTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW1RvYXN0XSxcbiAgZXhwb3J0czogW1RvYXN0XSxcbiAgZW50cnlDb21wb25lbnRzOiBbVG9hc3RdLFxufSlcbmV4cG9ydCBjbGFzcyBUb2FzdHJNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IFBhcnRpYWw8R2xvYmFsQ29uZmlnPiA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxUb2FzdHJNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFRvYXN0ck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogVE9BU1RfQ09ORklHLFxuICAgICAgICAgIHVzZVZhbHVlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBEZWZhdWx0R2xvYmFsQ29uZmlnLFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIFRvYXN0ckNvbXBvbmVudGxlc3NNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IFBhcnRpYWw8R2xvYmFsQ29uZmlnPiA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxUb2FzdHJNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFRvYXN0ck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogVE9BU1RfQ09ORklHLFxuICAgICAgICAgIHVzZVZhbHVlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBEZWZhdWx0Tm9Db21wb25lbnRHbG9iYWxDb25maWcsXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxufVxuIl19