import { Pipe } from '@angular/core';
import { pipe } from 'imask';
import * as i0 from "@angular/core";
export { PIPE_TYPE, pipe } from 'imask';
/*
 * Transforms value through mask
 * Takes mask and optionally `from` and `to` pipe types.
 * Usage:
 *   value | imask:MASK_OR_MASKED:opt_from:opt_to
 * Example:
 *   {{ 2 | imask:mask }}
*/
export class IMaskPipe {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hc2sucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbWFzay5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxPQUFPLENBQUM7O0FBQzdCLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBR3hDOzs7Ozs7O0VBT0U7QUFFRixNQUFNLE9BQU8sU0FBUztJQUNwQixTQUFTLENBQUUsR0FBRyxJQUE2QjtRQUN6QyxPQUFPLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7O3NHQUhVLFNBQVM7b0dBQVQsU0FBUzsyRkFBVCxTQUFTO2tCQURyQixJQUFJO21CQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgcGlwZSB9IGZyb20gJ2ltYXNrJztcbmV4cG9ydCB7IFBJUEVfVFlQRSwgcGlwZSB9IGZyb20gJ2ltYXNrJztcblxuXG4vKlxuICogVHJhbnNmb3JtcyB2YWx1ZSB0aHJvdWdoIG1hc2tcbiAqIFRha2VzIG1hc2sgYW5kIG9wdGlvbmFsbHkgYGZyb21gIGFuZCBgdG9gIHBpcGUgdHlwZXMuXG4gKiBVc2FnZTpcbiAqICAgdmFsdWUgfCBpbWFzazpNQVNLX09SX01BU0tFRDpvcHRfZnJvbTpvcHRfdG9cbiAqIEV4YW1wbGU6XG4gKiAgIHt7IDIgfCBpbWFzazptYXNrIH19XG4qL1xuQFBpcGUoe25hbWU6ICdpbWFzayd9KVxuZXhwb3J0IGNsYXNzIElNYXNrUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0gKC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIHBpcGU+KTogUmV0dXJuVHlwZTx0eXBlb2YgcGlwZT4ge1xuICAgIHJldHVybiBwaXBlKC4uLmFyZ3MpO1xuICB9XG59XG4iXX0=