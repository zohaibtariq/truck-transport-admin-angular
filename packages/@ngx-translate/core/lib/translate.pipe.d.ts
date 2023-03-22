import { ChangeDetectorRef, OnDestroy, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
export declare class TranslatePipe implements PipeTransform, OnDestroy {
    private translate;
    private _ref;
    value: string;
    lastKey: string | null;
    lastParams: any[];
    onTranslationChange: Subscription | undefined;
    onLangChange: Subscription | undefined;
    onDefaultLangChange: Subscription | undefined;
    constructor(translate: TranslateService, _ref: ChangeDetectorRef);
    updateValue(key: string, interpolateParams?: Object, translations?: any): void;
    transform(query: string, ...args: any[]): any;
    /**
     * Clean any existing subscription to change events
     */
    private _dispose;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TranslatePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<TranslatePipe, "translate">;
    static ɵprov: i0.ɵɵInjectableDeclaration<TranslatePipe>;
}
