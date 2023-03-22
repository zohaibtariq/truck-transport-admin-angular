import { isPlatformBrowser, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Injectable, forwardRef, EventEmitter, PLATFORM_ID, Directive, Inject, Optional, Input, Output, Pipe, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import IMask, { pipe } from 'imask';
export { PIPE_TYPE, pipe } from 'imask';

class IMaskFactory {
}
IMaskFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
IMaskFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskFactory, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskFactory, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

const MASKEDINPUT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IMaskDirective),
    multi: true
};
const DEFAULT_IMASK_ELEMENT = (elementRef) => elementRef.nativeElement;
class IMaskDirective {
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
IMaskDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: IMaskFactory }, { token: PLATFORM_ID }, { token: COMPOSITION_BUFFER_MODE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
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
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: IMaskFactory }, { type: undefined, decorators: [{
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

/*
 * Transforms value through mask
 * Takes mask and optionally `from` and `to` pipe types.
 * Usage:
 *   value | imask:MASK_OR_MASKED:opt_from:opt_to
 * Example:
 *   {{ 2 | imask:mask }}
*/
class IMaskPipe {
    transform(...args) {
        return pipe(...args);
    }
}
IMaskPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IMaskPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskPipe, name: "imask" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'imask' }]
        }] });

class DefaultImaskFactory {
    create(el, opts) {
        return IMask(el, opts);
    }
}
DefaultImaskFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: DefaultImaskFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
DefaultImaskFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: DefaultImaskFactory, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: DefaultImaskFactory, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class IMaskDirectiveModule {
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

class IMaskModule {
}
IMaskModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IMaskModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskModule, declarations: [IMaskPipe], imports: [CommonModule, IMaskDirectiveModule], exports: [IMaskPipe, IMaskDirectiveModule] });
IMaskModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskModule, imports: [[CommonModule, IMaskDirectiveModule], IMaskDirectiveModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IMaskModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, IMaskDirectiveModule],
                    declarations: [IMaskPipe],
                    exports: [IMaskPipe, IMaskDirectiveModule]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { IMaskDirective, IMaskDirectiveModule, IMaskFactory, IMaskModule, IMaskPipe, MASKEDINPUT_VALUE_ACCESSOR };
//# sourceMappingURL=angular-imask.mjs.map
