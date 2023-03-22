import { PipeTransform } from '@angular/core';
import { pipe } from 'imask';
import * as i0 from "@angular/core";
export { PIPE_TYPE, pipe } from 'imask';
export declare class IMaskPipe implements PipeTransform {
    transform(...args: Parameters<typeof pipe>): ReturnType<typeof pipe>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IMaskPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IMaskPipe, "imask">;
}
