/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs';
export function mixinErrorState(base) {
    return class extends base {
        constructor(...args) {
            super(...args);
            // This class member exists as an interop with `MatFormFieldControl` which expects
            // a public `stateChanges` observable to emit whenever the form field should be updated.
            // The description is not specifically mentioning the error state, as classes using this
            // mixin can/should emit an event in other cases too.
            /** Emits whenever the component state changes. */
            this.stateChanges = new Subject();
            /** Whether the component is in an error state. */
            this.errorState = false;
        }
        /** Updates the error state based on the provided error state matcher. */
        updateErrorState() {
            const oldState = this.errorState;
            const parent = this._parentFormGroup || this._parentForm;
            const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
            const control = this.ngControl ? this.ngControl.control : null;
            const newState = matcher.isErrorState(control, parent);
            if (newState !== oldState) {
                this.errorState = newState;
                this.stateChanges.next();
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3Itc3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2Vycm9yLXN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFrQzdCLE1BQU0sVUFBVSxlQUFlLENBQzdCLElBQU87SUFFUCxPQUFPLEtBQU0sU0FBUSxJQUFJO1FBNEJ2QixZQUFZLEdBQUcsSUFBVztZQUN4QixLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQTVCakIsa0ZBQWtGO1lBQ2xGLHdGQUF3RjtZQUN4Rix3RkFBd0Y7WUFDeEYscURBQXFEO1lBQ3JELGtEQUFrRDtZQUN6QyxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7WUFFNUMsa0RBQWtEO1lBQ2xELGVBQVUsR0FBWSxLQUFLLENBQUM7UUFxQjVCLENBQUM7UUFoQkQseUVBQXlFO1FBQ3pFLGdCQUFnQjtZQUNkLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDekQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztZQUN6RSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQXVCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNoRixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUV2RCxJQUFJLFFBQVEsS0FBSyxRQUFRLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO2dCQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzFCO1FBQ0gsQ0FBQztLQUtGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9ybUNvbnRyb2wsIEZvcm1Hcm91cERpcmVjdGl2ZSwgTmdDb250cm9sLCBOZ0Zvcm19IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyfSBmcm9tICcuLi9lcnJvci9lcnJvci1vcHRpb25zJztcbmltcG9ydCB7QWJzdHJhY3RDb25zdHJ1Y3RvciwgQ29uc3RydWN0b3J9IGZyb20gJy4vY29uc3RydWN0b3InO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGludGVyZmFjZSBDYW5VcGRhdGVFcnJvclN0YXRlIHtcbiAgLyoqIEVtaXRzIHdoZW5ldmVyIHRoZSBjb21wb25lbnQgc3RhdGUgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+O1xuICAvKiogVXBkYXRlcyB0aGUgZXJyb3Igc3RhdGUgYmFzZWQgb24gdGhlIHByb3ZpZGVkIGVycm9yIHN0YXRlIG1hdGNoZXIuICovXG4gIHVwZGF0ZUVycm9yU3RhdGUoKTogdm9pZDtcbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBpbiBhbiBlcnJvciBzdGF0ZS4gKi9cbiAgZXJyb3JTdGF0ZTogYm9vbGVhbjtcbiAgLyoqIEFuIG9iamVjdCB1c2VkIHRvIGNvbnRyb2wgdGhlIGVycm9yIHN0YXRlIG9mIHRoZSBjb21wb25lbnQuICovXG4gIGVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcjtcbn1cblxudHlwZSBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvciA9IENvbnN0cnVjdG9yPENhblVwZGF0ZUVycm9yU3RhdGU+ICZcbiAgQWJzdHJhY3RDb25zdHJ1Y3RvcjxDYW5VcGRhdGVFcnJvclN0YXRlPjtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgSGFzRXJyb3JTdGF0ZSB7XG4gIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZTtcbiAgX3BhcmVudEZvcm06IE5nRm9ybTtcbiAgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXI7XG4gIG5nQ29udHJvbDogTmdDb250cm9sO1xufVxuXG4vKipcbiAqIE1peGluIHRvIGF1Z21lbnQgYSBkaXJlY3RpdmUgd2l0aCB1cGRhdGVFcnJvclN0YXRlIG1ldGhvZC5cbiAqIEZvciBjb21wb25lbnQgd2l0aCBgZXJyb3JTdGF0ZWAgYW5kIG5lZWQgdG8gdXBkYXRlIGBlcnJvclN0YXRlYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluRXJyb3JTdGF0ZTxUIGV4dGVuZHMgQWJzdHJhY3RDb25zdHJ1Y3RvcjxIYXNFcnJvclN0YXRlPj4oXG4gIGJhc2U6IFQsXG4pOiBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvciAmIFQ7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW5FcnJvclN0YXRlPFQgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIYXNFcnJvclN0YXRlPj4oXG4gIGJhc2U6IFQsXG4pOiBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvciAmIFQge1xuICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBiYXNlIHtcbiAgICAvLyBUaGlzIGNsYXNzIG1lbWJlciBleGlzdHMgYXMgYW4gaW50ZXJvcCB3aXRoIGBNYXRGb3JtRmllbGRDb250cm9sYCB3aGljaCBleHBlY3RzXG4gICAgLy8gYSBwdWJsaWMgYHN0YXRlQ2hhbmdlc2Agb2JzZXJ2YWJsZSB0byBlbWl0IHdoZW5ldmVyIHRoZSBmb3JtIGZpZWxkIHNob3VsZCBiZSB1cGRhdGVkLlxuICAgIC8vIFRoZSBkZXNjcmlwdGlvbiBpcyBub3Qgc3BlY2lmaWNhbGx5IG1lbnRpb25pbmcgdGhlIGVycm9yIHN0YXRlLCBhcyBjbGFzc2VzIHVzaW5nIHRoaXNcbiAgICAvLyBtaXhpbiBjYW4vc2hvdWxkIGVtaXQgYW4gZXZlbnQgaW4gb3RoZXIgY2FzZXMgdG9vLlxuICAgIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgY29tcG9uZW50IHN0YXRlIGNoYW5nZXMuICovXG4gICAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAgIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgaW4gYW4gZXJyb3Igc3RhdGUuICovXG4gICAgZXJyb3JTdGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqIEFuIG9iamVjdCB1c2VkIHRvIGNvbnRyb2wgdGhlIGVycm9yIHN0YXRlIG9mIHRoZSBjb21wb25lbnQuICovXG4gICAgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xuXG4gICAgLyoqIFVwZGF0ZXMgdGhlIGVycm9yIHN0YXRlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBlcnJvciBzdGF0ZSBtYXRjaGVyLiAqL1xuICAgIHVwZGF0ZUVycm9yU3RhdGUoKSB7XG4gICAgICBjb25zdCBvbGRTdGF0ZSA9IHRoaXMuZXJyb3JTdGF0ZTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudEZvcm1Hcm91cCB8fCB0aGlzLl9wYXJlbnRGb3JtO1xuICAgICAgY29uc3QgbWF0Y2hlciA9IHRoaXMuZXJyb3JTdGF0ZU1hdGNoZXIgfHwgdGhpcy5fZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyO1xuICAgICAgY29uc3QgY29udHJvbCA9IHRoaXMubmdDb250cm9sID8gKHRoaXMubmdDb250cm9sLmNvbnRyb2wgYXMgRm9ybUNvbnRyb2wpIDogbnVsbDtcbiAgICAgIGNvbnN0IG5ld1N0YXRlID0gbWF0Y2hlci5pc0Vycm9yU3RhdGUoY29udHJvbCwgcGFyZW50KTtcblxuICAgICAgaWYgKG5ld1N0YXRlICE9PSBvbGRTdGF0ZSkge1xuICAgICAgICB0aGlzLmVycm9yU3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcbiAgICB9XG4gIH07XG59XG4iXX0=