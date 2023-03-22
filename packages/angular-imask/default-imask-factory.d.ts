import { IMaskFactory } from "./imask-factory";
import IMask from 'imask';
import * as i0 from "@angular/core";
export declare class DefaultImaskFactory implements IMaskFactory {
    create<Opts extends IMask.AnyMaskedOptions>(el: IMask.MaskElement | IMask.HTMLMaskingElement, opts: Opts): IMask.InputMask<Opts>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DefaultImaskFactory, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DefaultImaskFactory>;
}
