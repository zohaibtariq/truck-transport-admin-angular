import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Input, Output, forwardRef, Renderer2, EventEmitter, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { NG_VALUE_ACCESSOR, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { IMaskFactory } from './imask-factory';
import * as i0 from "@angular/core";
import * as i1 from "./imask-factory";
export const MASKEDINPUT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IMaskDirective),
    multi: true
};
const DEFAULT_IMASK_ELEMENT = (elementRef) => elementRef.nativeElement;
export class IMaskDirective {
    constructor(_elementRef, _renderer, _factory, _platformId, _compositionMode) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._factory = _factory;
        this._platformId = _platformId;
        this._compositionMode = _compositionMode;
        // init here to support AOT (TODO may be will work with ng-packgr - need to check)
        this.onTouched = () => { };
        this.onChange = () => { };
        this.imaskElement = DEFAULT_IMASK_ELEMENT;
        this.accept = new EventEmitter();
        this.complete = new EventEmitter();
        this._viewInitialized = false;
        this._composing = false;
        this._writing = false;
        if (this._compositionMode == null) {
            this._compositionMode = !this._isAndroid();
        }
    }
    get element() {
        return this.imaskElement(this._elementRef, this);
    }
    get maskValue() {
        if (!this.maskRef)
            return this.element.value;
        if (this.unmask === 'typed')
            return this.maskRef.typedValue;
        if (this.unmask)
            return this.maskRef.unmaskedValue;
        return this.maskRef.value;
    }
    set maskValue(value) {
        if (this.maskRef) {
            if (this.unmask === 'typed')
                this.maskRef.typedValue = value;
            else if (this.unmask)
                this.maskRef.unmaskedValue = value;
            else
                this.maskRef.value = value;
        }
        else {
            this._renderer.setProperty(this.element, 'value', value);
        }
    }
    ngAfterViewInit() {
        if (this.imask)
            this.initMask();
        this._viewInitialized = true;
    }
    ngOnChanges(changes) {
        if (changes.elementRef && !this.imaskElement)
            this.imaskElement = DEFAULT_IMASK_ELEMENT;
        if (!changes.imask || !this._viewInitialized)
            return;
        if (this.imask) {
            if (this.maskRef)
                this.maskRef.updateOptions(this.imask);
            else {
                this.initMask();
                this.onChange(this.maskValue);
            }
        }
        else {
            this.destroyMask();
        }
    }
    destroyMask() {
        if (this.maskRef) {
            this.maskRef.destroy();
            delete this.maskRef;
        }
    }
    ngOnDestroy() {
        this.destroyMask();
        this.accept.complete();
        this.complete.complete();
    }
    beginWrite(value) {
        this._writing = true;
        this._writingValue = value;
    }
    endWrite() {
        this._writing = false;
        return this._writingValue;
    }
    writeValue(value) {
        value = value == null ? '' : value;
        if (this.maskRef) {
            this.beginWrite(value);
            if (this.maskValue !== value ||
                // handle cases like Number('') === 0,
                // for details see https://github.com/uNmAnNeR/imaskjs/issues/134
                (typeof value !== 'string' && this.maskRef.value === '') &&
                    !this.maskRef.el.isActive) {
                this.maskValue = value;
            }
        }
        else {
            this._renderer.setProperty(this.element, 'value', value);
        }
    }
    _onAccept() {
        const value = this.maskValue;
        // if value was not changed during writing don't fire events
        // for details see https://github.com/uNmAnNeR/imaskjs/issues/136
        if (this._writing && value === this.endWrite())
            return;
        this.onChange(value);
        this.accept.emit(value);
    }
    _onComplete() {
        this.complete.emit(this.maskValue);
    }
    initMask() {
        this.maskRef = this._factory.create(this.element, this.imask)
            .on('accept', this._onAccept.bind(this))
            .on('complete', this._onComplete.bind(this));
    }
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this.element, 'disabled', isDisabled);
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    _handleInput(value) {
        // if mask is attached all input goes throw mask
        if (this.maskRef)
            return;
        if (!this._compositionMode || (this._compositionMode && !this._composing)) {
            this.onChange(value);
        }
    }
    _compositionStart() { this._composing = true; }
    _compositionEnd(value) {
        this._composing = false;
        this._compositionMode && this._handleInput(value);
    }
    _isAndroid() {
        return isPlatformBrowser(this._platformId) && /android (\d+)/.test(navigator.userAgent.toLowerCase());
    }
}
IMaskDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.IMaskFactory }, { token: PLATFORM_ID }, { token: COMPOSITION_BUFFER_MODE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
IMaskDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IMaskDirective, selector: "[imask]", inputs: { imask: "imask", unmask: "unmask", imaskElement: "imaskElement" }, outputs: { accept: "accept", complete: "complete" }, host: { listeners: { "input": "_handleInput($event.target.value)", "blur": "onTouched()", "compositionstart": "_compositionStart()", "compositionend": "_compositionEnd($event.target.value)" } }, providers: [MASKEDINPUT_VALUE_ACCESSOR], exportAs: ["imask"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[imask]',
                    exportAs: 'imask',
                    host: {
                        '(input)': '_handleInput($event.target.value)',
                        '(blur)': 'onTouched()',
                        '(compositionstart)': '_compositionStart()',
                        '(compositionend)': '_compositionEnd($event.target.value)'
                    },
                    providers: [MASKEDINPUT_VALUE_ACCESSOR],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.IMaskFactory }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [COMPOSITION_BUFFER_MODE]
                }] }]; }, propDecorators: { imask: [{
                type: Input
            }], unmask: [{
                type: Input
            }], imaskElement: [{
                type: Input
            }], accept: [{
                type: Output
            }], complete: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hc2suZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ltYXNrLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQ0wsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBWSxTQUFTLEVBQ3JFLFlBQVksRUFDWixRQUFRLEVBQUUsTUFBTSxFQUFpQixXQUFXLEVBQzdDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBd0IsdUJBQXVCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7OztBQUkvQyxNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBYTtJQUNsRCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO0lBQzdDLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxVQUFlLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7QUFZNUUsTUFBTSxPQUFPLGNBQWM7SUFlekIsWUFBb0IsV0FBdUIsRUFDdkIsU0FBb0IsRUFDcEIsUUFBc0IsRUFDRCxXQUFtQixFQUNLLGdCQUF5QjtRQUp0RSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLGFBQVEsR0FBUixRQUFRLENBQWM7UUFDRCxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNLLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUztRQUN4RixrRkFBa0Y7UUFDbEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFDMUIs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TTtnQkFDRyxRQUFRO3NCQUFqQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgT3V0cHV0LCBmb3J3YXJkUmVmLCBQcm92aWRlciwgUmVuZGVyZXIyLFxuICBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0LFxuICBPcHRpb25hbCwgSW5qZWN0LCBTaW1wbGVDaGFuZ2VzLCBQTEFURk9STV9JRFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgQ09NUE9TSVRJT05fQlVGRkVSX01PREUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IElNYXNrRmFjdG9yeSB9IGZyb20gJy4vaW1hc2stZmFjdG9yeSc7XG5pbXBvcnQgSU1hc2sgZnJvbSAnaW1hc2snO1xuXG5cbmV4cG9ydCBjb25zdCBNQVNLRURJTlBVVF9WQUxVRV9BQ0NFU1NPUjogUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBJTWFza0RpcmVjdGl2ZSksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5jb25zdCBERUZBVUxUX0lNQVNLX0VMRU1FTlQgPSAoZWxlbWVudFJlZjogYW55KSA9PiBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbaW1hc2tdJyxcbiAgZXhwb3J0QXM6ICdpbWFzaycsXG4gIGhvc3Q6IHtcbiAgICAnKGlucHV0KSc6ICdfaGFuZGxlSW5wdXQoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICcoYmx1ciknOiAnb25Ub3VjaGVkKCknLFxuICAgICcoY29tcG9zaXRpb25zdGFydCknOiAnX2NvbXBvc2l0aW9uU3RhcnQoKScsXG4gICAgJyhjb21wb3NpdGlvbmVuZCknOiAnX2NvbXBvc2l0aW9uRW5kKCRldmVudC50YXJnZXQudmFsdWUpJ1xuICB9LFxuICBwcm92aWRlcnM6IFtNQVNLRURJTlBVVF9WQUxVRV9BQ0NFU1NPUl0sXG59KVxuZXhwb3J0IGNsYXNzIElNYXNrRGlyZWN0aXZlPE9wdHMgZXh0ZW5kcyBJTWFzay5BbnlNYXNrZWRPcHRpb25zPiBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIG1hc2tSZWY/OiBJTWFzay5JbnB1dE1hc2s8T3B0cz47XG4gIG9uVG91Y2hlZDogYW55O1xuICBvbkNoYW5nZTogYW55O1xuICBwcml2YXRlIF92aWV3SW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX2NvbXBvc2luZzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfd3JpdGluZ1ZhbHVlOiBhbnk7XG4gIHByaXZhdGUgX3dyaXRpbmc6IGJvb2xlYW47XG5cbiAgQElucHV0KCkgaW1hc2s/OiBPcHRzO1xuICBASW5wdXQoKSB1bm1hc2s/OiBib29sZWFufCd0eXBlZCc7XG4gIEBJbnB1dCgpIGltYXNrRWxlbWVudDogKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIGRpcmVjdGl2ZVJlZjogYW55KSA9PiBJTWFzay5NYXNrRWxlbWVudDtcbiAgQE91dHB1dCgpIGFjY2VwdDogRXZlbnRFbWl0dGVyPGFueT47XG4gIEBPdXRwdXQoKSBjb21wbGV0ZTogRXZlbnRFbWl0dGVyPGFueT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZmFjdG9yeTogSU1hc2tGYWN0b3J5LFxuICAgICAgICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIF9wbGF0Zm9ybUlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQ09NUE9TSVRJT05fQlVGRkVSX01PREUpIHByaXZhdGUgX2NvbXBvc2l0aW9uTW9kZTogYm9vbGVhbikge1xuICAgIC8vIGluaXQgaGVyZSB0byBzdXBwb3J0IEFPVCAoVE9ETyBtYXkgYmUgd2lsbCB3b3JrIHdpdGggbmctcGFja2dyIC0gbmVlZCB0byBjaGVjaylcbiAgICB0aGlzLm9uVG91Y2hlZCA9ICgpID0+IHt9O1xuICAgIHRoaXMub25DaGFuZ2UgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmltYXNrRWxlbWVudCA9IERFRkFVTFRfSU1BU0tfRUxFTUVOVDtcbiAgICB0aGlzLmFjY2VwdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB0aGlzLmNvbXBsZXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHRoaXMuX3ZpZXdJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuX2NvbXBvc2luZyA9IGZhbHNlO1xuICAgIHRoaXMuX3dyaXRpbmcgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fY29tcG9zaXRpb25Nb2RlID0gIXRoaXMuX2lzQW5kcm9pZCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBlbGVtZW50ICgpIHtcbiAgICByZXR1cm4gdGhpcy5pbWFza0VsZW1lbnQodGhpcy5fZWxlbWVudFJlZiwgdGhpcyk7XG4gIH1cblxuICBnZXQgbWFza1ZhbHVlICgpOiBhbnkge1xuICAgIGlmICghdGhpcy5tYXNrUmVmKSByZXR1cm4gdGhpcy5lbGVtZW50LnZhbHVlO1xuXG4gICAgaWYgKHRoaXMudW5tYXNrID09PSAndHlwZWQnKSByZXR1cm4gdGhpcy5tYXNrUmVmLnR5cGVkVmFsdWU7XG4gICAgaWYgKHRoaXMudW5tYXNrKSByZXR1cm4gdGhpcy5tYXNrUmVmLnVubWFza2VkVmFsdWU7XG4gICAgcmV0dXJuIHRoaXMubWFza1JlZi52YWx1ZTtcbiAgfVxuXG4gIHNldCBtYXNrVmFsdWUgKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5tYXNrUmVmKSB7XG4gICAgICBpZiAodGhpcy51bm1hc2sgPT09ICd0eXBlZCcpIHRoaXMubWFza1JlZi50eXBlZFZhbHVlID0gdmFsdWU7XG4gICAgICBlbHNlIGlmICh0aGlzLnVubWFzaykgdGhpcy5tYXNrUmVmLnVubWFza2VkVmFsdWUgPSB2YWx1ZTtcbiAgICAgIGVsc2UgdGhpcy5tYXNrUmVmLnZhbHVlID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudCwgJ3ZhbHVlJywgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5pbWFzaykgdGhpcy5pbml0TWFzaygpO1xuXG4gICAgdGhpcy5fdmlld0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5lbGVtZW50UmVmICYmICF0aGlzLmltYXNrRWxlbWVudCkgdGhpcy5pbWFza0VsZW1lbnQgPSBERUZBVUxUX0lNQVNLX0VMRU1FTlQ7XG5cbiAgICBpZiAoIWNoYW5nZXMuaW1hc2sgfHwgIXRoaXMuX3ZpZXdJbml0aWFsaXplZCkgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMuaW1hc2spIHtcbiAgICAgIGlmICh0aGlzLm1hc2tSZWYpIHRoaXMubWFza1JlZi51cGRhdGVPcHRpb25zKHRoaXMuaW1hc2spO1xuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuaW5pdE1hc2soKTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLm1hc2tWYWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVzdHJveU1hc2soKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95TWFzayAoKSB7XG4gICAgaWYgKHRoaXMubWFza1JlZikge1xuICAgICAgdGhpcy5tYXNrUmVmLmRlc3Ryb3koKTtcbiAgICAgIGRlbGV0ZSB0aGlzLm1hc2tSZWY7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3kgKCkge1xuICAgIHRoaXMuZGVzdHJveU1hc2soKTtcbiAgICB0aGlzLmFjY2VwdC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuY29tcGxldGUuY29tcGxldGUoKTtcbiAgfVxuXG4gIGJlZ2luV3JpdGUgKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl93cml0aW5nID0gdHJ1ZTtcbiAgICB0aGlzLl93cml0aW5nVmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGVuZFdyaXRlICgpOiBhbnkge1xuICAgIHRoaXMuX3dyaXRpbmcgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5fd3JpdGluZ1ZhbHVlO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcblxuICAgIGlmICh0aGlzLm1hc2tSZWYpIHtcbiAgICAgIHRoaXMuYmVnaW5Xcml0ZSh2YWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLm1hc2tWYWx1ZSAhPT0gdmFsdWUgfHxcbiAgICAgICAgLy8gaGFuZGxlIGNhc2VzIGxpa2UgTnVtYmVyKCcnKSA9PT0gMCxcbiAgICAgICAgLy8gZm9yIGRldGFpbHMgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91Tm1Bbk5lUi9pbWFza2pzL2lzc3Vlcy8xMzRcbiAgICAgICAgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgJiYgdGhpcy5tYXNrUmVmLnZhbHVlID09PSAnJykgJiZcbiAgICAgICAgICAhdGhpcy5tYXNrUmVmLmVsLmlzQWN0aXZlXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5tYXNrVmFsdWUgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50LCAndmFsdWUnLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgX29uQWNjZXB0ICgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMubWFza1ZhbHVlO1xuICAgIC8vIGlmIHZhbHVlIHdhcyBub3QgY2hhbmdlZCBkdXJpbmcgd3JpdGluZyBkb24ndCBmaXJlIGV2ZW50c1xuICAgIC8vIGZvciBkZXRhaWxzIHNlZSBodHRwczovL2dpdGh1Yi5jb20vdU5tQW5OZVIvaW1hc2tqcy9pc3N1ZXMvMTM2XG4gICAgaWYgKHRoaXMuX3dyaXRpbmcgJiYgdmFsdWUgPT09IHRoaXMuZW5kV3JpdGUoKSkgcmV0dXJuO1xuICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgIHRoaXMuYWNjZXB0LmVtaXQodmFsdWUpO1xuICB9XG5cbiAgX29uQ29tcGxldGUgKCkge1xuICAgIHRoaXMuY29tcGxldGUuZW1pdCh0aGlzLm1hc2tWYWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGluaXRNYXNrICgpIHtcbiAgICB0aGlzLm1hc2tSZWYgPSB0aGlzLl9mYWN0b3J5LmNyZWF0ZSh0aGlzLmVsZW1lbnQsIHRoaXMuaW1hc2sgYXMgT3B0cylcbiAgICAgIC5vbignYWNjZXB0JywgdGhpcy5fb25BY2NlcHQuYmluZCh0aGlzKSlcbiAgICAgIC5vbignY29tcGxldGUnLCB0aGlzLl9vbkNvbXBsZXRlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZSAoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZClcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuIH1cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbiB9XG5cbiAgX2hhbmRsZUlucHV0KHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAvLyBpZiBtYXNrIGlzIGF0dGFjaGVkIGFsbCBpbnB1dCBnb2VzIHRocm93IG1hc2tcbiAgICBpZiAodGhpcy5tYXNrUmVmKSByZXR1cm47XG5cbiAgICBpZiAoIXRoaXMuX2NvbXBvc2l0aW9uTW9kZSB8fCAodGhpcy5fY29tcG9zaXRpb25Nb2RlICYmICF0aGlzLl9jb21wb3NpbmcpKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBfY29tcG9zaXRpb25TdGFydCgpOiB2b2lkIHsgdGhpcy5fY29tcG9zaW5nID0gdHJ1ZTsgfVxuXG4gIF9jb21wb3NpdGlvbkVuZCh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fY29tcG9zaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fY29tcG9zaXRpb25Nb2RlICYmIHRoaXMuX2hhbmRsZUlucHV0KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzQW5kcm9pZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5fcGxhdGZvcm1JZCkgJiYgL2FuZHJvaWQgKFxcZCspLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XG4gIH1cbn1cbiJdfQ==