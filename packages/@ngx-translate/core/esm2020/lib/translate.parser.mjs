import { Injectable } from "@angular/core";
import { isDefined } from "./util";
import * as i0 from "@angular/core";
export class TranslateParser {
}
export class TranslateDefaultParser extends TranslateParser {
    constructor() {
        super(...arguments);
        this.templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
    }
    interpolate(expr, params) {
        let result;
        if (typeof expr === 'string') {
            result = this.interpolateString(expr, params);
        }
        else if (typeof expr === 'function') {
            result = this.interpolateFunction(expr, params);
        }
        else {
            // this should not happen, but an unrelated TranslateService test depends on it
            result = expr;
        }
        return result;
    }
    getValue(target, key) {
        let keys = typeof key === 'string' ? key.split('.') : [key];
        key = '';
        do {
            key += keys.shift();
            if (isDefined(target) && isDefined(target[key]) && (typeof target[key] === 'object' || !keys.length)) {
                target = target[key];
                key = '';
            }
            else if (!keys.length) {
                target = undefined;
            }
            else {
                key += '.';
            }
        } while (keys.length);
        return target;
    }
    interpolateFunction(fn, params) {
        return fn(params);
    }
    interpolateString(expr, params) {
        if (!params) {
            return expr;
        }
        return expr.replace(this.templateMatcher, (substring, b) => {
            let r = this.getValue(params, b);
            return isDefined(r) ? r : substring;
        });
    }
}
TranslateDefaultParser.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: TranslateDefaultParser, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
TranslateDefaultParser.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: TranslateDefaultParser });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: TranslateDefaultParser, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC10cmFuc2xhdGUvY29yZS9zcmMvbGliL3RyYW5zbGF0ZS5wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sUUFBUSxDQUFDOztBQUVqQyxNQUFNLE9BQWdCLGVBQWU7Q0FnQnBDO0FBR0QsTUFBTSxPQUFPLHNCQUF1QixTQUFRLGVBQWU7SUFEM0Q7O1FBRUUsb0JBQWUsR0FBVyx1QkFBdUIsQ0FBQztLQWlEbkQ7SUEvQ1EsV0FBVyxDQUFDLElBQXVCLEVBQUUsTUFBWTtRQUN0RCxJQUFJLE1BQWMsQ0FBQztRQUVuQixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUMvQzthQUFNLElBQUksT0FBTyxJQUFJLEtBQUssVUFBVSxFQUFFO1lBQ3JDLE1BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ2pEO2FBQU07WUFDTCwrRUFBK0U7WUFDL0UsTUFBTSxHQUFHLElBQWMsQ0FBQztTQUN6QjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxRQUFRLENBQUMsTUFBVyxFQUFFLEdBQVc7UUFDL0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVELEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDVCxHQUFHO1lBQ0QsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQixJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3BHLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLEdBQUcsR0FBRyxFQUFFLENBQUM7YUFDVjtpQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDdkIsTUFBTSxHQUFHLFNBQVMsQ0FBQzthQUNwQjtpQkFBTTtnQkFDTCxHQUFHLElBQUksR0FBRyxDQUFDO2FBQ1o7U0FDRixRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFFdEIsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVPLG1CQUFtQixDQUFDLEVBQVksRUFBRSxNQUFZO1FBQ3BELE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxJQUFZLEVBQUUsTUFBWTtRQUNsRCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsU0FBaUIsRUFBRSxDQUFTLEVBQUUsRUFBRTtZQUN6RSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqQyxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzttSEFqRFUsc0JBQXNCO3VIQUF0QixzQkFBc0I7MkZBQXRCLHNCQUFzQjtrQkFEbEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHtpc0RlZmluZWR9IGZyb20gXCIuL3V0aWxcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUcmFuc2xhdGVQYXJzZXIge1xyXG4gIC8qKlxyXG4gICAqIEludGVycG9sYXRlcyBhIHN0cmluZyB0byByZXBsYWNlIHBhcmFtZXRlcnNcclxuICAgKiBcIlRoaXMgaXMgYSB7eyBrZXkgfX1cIiA9PT4gXCJUaGlzIGlzIGEgdmFsdWVcIiwgd2l0aCBwYXJhbXMgPSB7IGtleTogXCJ2YWx1ZVwiIH1cclxuICAgKiBAcGFyYW0gZXhwclxyXG4gICAqIEBwYXJhbSBwYXJhbXNcclxuICAgKi9cclxuICBhYnN0cmFjdCBpbnRlcnBvbGF0ZShleHByOiBzdHJpbmcgfCBGdW5jdGlvbiwgcGFyYW1zPzogYW55KTogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAvKipcclxuICAgKiBHZXRzIGEgdmFsdWUgZnJvbSBhbiBvYmplY3QgYnkgY29tcG9zZWQga2V5XHJcbiAgICogcGFyc2VyLmdldFZhbHVlKHsga2V5MTogeyBrZXlBOiAndmFsdWVJJyB9fSwgJ2tleTEua2V5QScpID09PiAndmFsdWVJJ1xyXG4gICAqIEBwYXJhbSB0YXJnZXRcclxuICAgKiBAcGFyYW0ga2V5XHJcbiAgICovXHJcbiAgYWJzdHJhY3QgZ2V0VmFsdWUodGFyZ2V0OiBhbnksIGtleTogc3RyaW5nKTogYW55XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0ZURlZmF1bHRQYXJzZXIgZXh0ZW5kcyBUcmFuc2xhdGVQYXJzZXIge1xyXG4gIHRlbXBsYXRlTWF0Y2hlcjogUmVnRXhwID0gL3t7XFxzPyhbXnt9XFxzXSopXFxzP319L2c7XHJcblxyXG4gIHB1YmxpYyBpbnRlcnBvbGF0ZShleHByOiBzdHJpbmcgfCBGdW5jdGlvbiwgcGFyYW1zPzogYW55KTogc3RyaW5nIHtcclxuICAgIGxldCByZXN1bHQ6IHN0cmluZztcclxuXHJcbiAgICBpZiAodHlwZW9mIGV4cHIgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaW50ZXJwb2xhdGVTdHJpbmcoZXhwciwgcGFyYW1zKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cHIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5pbnRlcnBvbGF0ZUZ1bmN0aW9uKGV4cHIsIHBhcmFtcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyB0aGlzIHNob3VsZCBub3QgaGFwcGVuLCBidXQgYW4gdW5yZWxhdGVkIFRyYW5zbGF0ZVNlcnZpY2UgdGVzdCBkZXBlbmRzIG9uIGl0XHJcbiAgICAgIHJlc3VsdCA9IGV4cHIgYXMgc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBnZXRWYWx1ZSh0YXJnZXQ6IGFueSwga2V5OiBzdHJpbmcpOiBhbnkge1xyXG4gICAgbGV0IGtleXMgPSB0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyA/IGtleS5zcGxpdCgnLicpIDogW2tleV07XHJcbiAgICBrZXkgPSAnJztcclxuICAgIGRvIHtcclxuICAgICAga2V5ICs9IGtleXMuc2hpZnQoKTtcclxuICAgICAgaWYgKGlzRGVmaW5lZCh0YXJnZXQpICYmIGlzRGVmaW5lZCh0YXJnZXRba2V5XSkgJiYgKHR5cGVvZiB0YXJnZXRba2V5XSA9PT0gJ29iamVjdCcgfHwgIWtleXMubGVuZ3RoKSkge1xyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldFtrZXldO1xyXG4gICAgICAgIGtleSA9ICcnO1xyXG4gICAgICB9IGVsc2UgaWYgKCFrZXlzLmxlbmd0aCkge1xyXG4gICAgICAgIHRhcmdldCA9IHVuZGVmaW5lZDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBrZXkgKz0gJy4nO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlIChrZXlzLmxlbmd0aCk7XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW50ZXJwb2xhdGVGdW5jdGlvbihmbjogRnVuY3Rpb24sIHBhcmFtcz86IGFueSkge1xyXG4gICAgcmV0dXJuIGZuKHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGludGVycG9sYXRlU3RyaW5nKGV4cHI6IHN0cmluZywgcGFyYW1zPzogYW55KSB7XHJcbiAgICBpZiAoIXBhcmFtcykge1xyXG4gICAgICByZXR1cm4gZXhwcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXhwci5yZXBsYWNlKHRoaXMudGVtcGxhdGVNYXRjaGVyLCAoc3Vic3RyaW5nOiBzdHJpbmcsIGI6IHN0cmluZykgPT4ge1xyXG4gICAgICBsZXQgciA9IHRoaXMuZ2V0VmFsdWUocGFyYW1zLCBiKTtcclxuICAgICAgcmV0dXJuIGlzRGVmaW5lZChyKSA/IHIgOiBzdWJzdHJpbmc7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19