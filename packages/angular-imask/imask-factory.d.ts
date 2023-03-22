import IMask from 'imask';
import * as i0 from "@angular/core";
export declare abstract class IMaskFactory {
    abstract create<Opts extends IMask.AnyMaskedOptions>(el: IMask.MaskElement | IMask.HTMLMaskingElement, opts: Opts): IMask.InputMask<Opts>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IMaskFactory, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IMaskFactory>;
}
