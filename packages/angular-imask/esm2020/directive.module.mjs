import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMaskDirective } from './imask.directive';
import { IMaskFactory } from './imask-factory';
import { DefaultImaskFactory } from './default-imask-factory';
import * as i0 from "@angular/core";
export class IMaskDirectiveModule {
}
IMaskDirectiveModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskDirectiveModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IMaskDirectiveModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskDirectiveModule, declarations: [IMaskDirective], imports: [CommonModule], exports: [IMaskDirective] });
IMaskDirectiveModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskDirectiveModule, providers: [{ provide: IMaskFactory, useClass: DefaultImaskFactory }], imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskDirectiveModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [IMaskDirective],
                    providers: [{ provide: IMaskFactory, useClass: DefaultImaskFactory }],
                    exports: [IMaskDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXJlY3RpdmUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7O0FBUzlELE1BQU0sT0FBTyxvQkFBb0I7O2lIQUFwQixvQkFBb0I7a0hBQXBCLG9CQUFvQixpQkFKaEIsY0FBYyxhQURuQixZQUFZLGFBR1osY0FBYztrSEFFYixvQkFBb0IsYUFIcEIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUMsWUFGMUQsQ0FBQyxZQUFZLENBQUM7MkZBS1osb0JBQW9CO2tCQU5oQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsWUFBWSxFQUFFLENBQUMsY0FBYyxDQUFDO29CQUM5QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUM7b0JBQ25FLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgSU1hc2tEaXJlY3RpdmUgfSBmcm9tICcuL2ltYXNrLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJTWFza0ZhY3RvcnkgfSBmcm9tICcuL2ltYXNrLWZhY3RvcnknO1xuaW1wb3J0IHsgRGVmYXVsdEltYXNrRmFjdG9yeSB9IGZyb20gJy4vZGVmYXVsdC1pbWFzay1mYWN0b3J5JztcblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbSU1hc2tEaXJlY3RpdmVdLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogSU1hc2tGYWN0b3J5LCB1c2VDbGFzczogRGVmYXVsdEltYXNrRmFjdG9yeX1dLFxuICBleHBvcnRzOiBbSU1hc2tEaXJlY3RpdmVdXG59KVxuZXhwb3J0IGNsYXNzIElNYXNrRGlyZWN0aXZlTW9kdWxlIHt9XG4iXX0=