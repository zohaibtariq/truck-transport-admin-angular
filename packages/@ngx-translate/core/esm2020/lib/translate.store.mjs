import { EventEmitter } from "@angular/core";
export class TranslateStore {
    constructor() {
        /**
         * The lang currently used
         */
        this.currentLang = this.defaultLang;
        /**
         * a list of translations per lang
         */
        this.translations = {};
        /**
         * an array of langs
         */
        this.langs = [];
        /**
         * An EventEmitter to listen to translation change events
         * onTranslationChange.subscribe((params: TranslationChangeEvent) => {
           *     // do something
           * });
         */
        this.onTranslationChange = new EventEmitter();
        /**
         * An EventEmitter to listen to lang change events
         * onLangChange.subscribe((params: LangChangeEvent) => {
           *     // do something
           * });
         */
        this.onLangChange = new EventEmitter();
        /**
         * An EventEmitter to listen to default lang change events
         * onDefaultLangChange.subscribe((params: DefaultLangChangeEvent) => {
           *     // do something
           * });
         */
        this.onDefaultLangChange = new EventEmitter();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXRyYW5zbGF0ZS9jb3JlL3NyYy9saWIvdHJhbnNsYXRlLnN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHM0MsTUFBTSxPQUFPLGNBQWM7SUFBM0I7UUFNRTs7V0FFRztRQUNJLGdCQUFXLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUU5Qzs7V0FFRztRQUNJLGlCQUFZLEdBQVEsRUFBRSxDQUFDO1FBRTlCOztXQUVHO1FBQ0ksVUFBSyxHQUFrQixFQUFFLENBQUM7UUFFakM7Ozs7O1dBS0c7UUFDSSx3QkFBbUIsR0FBeUMsSUFBSSxZQUFZLEVBQTBCLENBQUM7UUFFOUc7Ozs7O1dBS0c7UUFDSSxpQkFBWSxHQUFrQyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQUV6Rjs7Ozs7V0FLRztRQUNJLHdCQUFtQixHQUF5QyxJQUFJLFlBQVksRUFBMEIsQ0FBQztJQUNoSCxDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHtEZWZhdWx0TGFuZ0NoYW5nZUV2ZW50LCBMYW5nQ2hhbmdlRXZlbnQsIFRyYW5zbGF0aW9uQ2hhbmdlRXZlbnR9IGZyb20gXCIuL3RyYW5zbGF0ZS5zZXJ2aWNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlU3RvcmUge1xyXG4gIC8qKlxyXG4gICAqIFRoZSBkZWZhdWx0IGxhbmcgdG8gZmFsbGJhY2sgd2hlbiB0cmFuc2xhdGlvbnMgYXJlIG1pc3Npbmcgb24gdGhlIGN1cnJlbnQgbGFuZ1xyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWZhdWx0TGFuZyE6IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGxhbmcgY3VycmVudGx5IHVzZWRcclxuICAgKi9cclxuICBwdWJsaWMgY3VycmVudExhbmc6IHN0cmluZyA9IHRoaXMuZGVmYXVsdExhbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIGEgbGlzdCBvZiB0cmFuc2xhdGlvbnMgcGVyIGxhbmdcclxuICAgKi9cclxuICBwdWJsaWMgdHJhbnNsYXRpb25zOiBhbnkgPSB7fTtcclxuXHJcbiAgLyoqXHJcbiAgICogYW4gYXJyYXkgb2YgbGFuZ3NcclxuICAgKi9cclxuICBwdWJsaWMgbGFuZ3M6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gRXZlbnRFbWl0dGVyIHRvIGxpc3RlbiB0byB0cmFuc2xhdGlvbiBjaGFuZ2UgZXZlbnRzXHJcbiAgICogb25UcmFuc2xhdGlvbkNoYW5nZS5zdWJzY3JpYmUoKHBhcmFtczogVHJhbnNsYXRpb25DaGFuZ2VFdmVudCkgPT4ge1xyXG4gICAgICogICAgIC8vIGRvIHNvbWV0aGluZ1xyXG4gICAgICogfSk7XHJcbiAgICovXHJcbiAgcHVibGljIG9uVHJhbnNsYXRpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxUcmFuc2xhdGlvbkNoYW5nZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8VHJhbnNsYXRpb25DaGFuZ2VFdmVudD4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gRXZlbnRFbWl0dGVyIHRvIGxpc3RlbiB0byBsYW5nIGNoYW5nZSBldmVudHNcclxuICAgKiBvbkxhbmdDaGFuZ2Uuc3Vic2NyaWJlKChwYXJhbXM6IExhbmdDaGFuZ2VFdmVudCkgPT4ge1xyXG4gICAgICogICAgIC8vIGRvIHNvbWV0aGluZ1xyXG4gICAgICogfSk7XHJcbiAgICovXHJcbiAgcHVibGljIG9uTGFuZ0NoYW5nZTogRXZlbnRFbWl0dGVyPExhbmdDaGFuZ2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPExhbmdDaGFuZ2VFdmVudD4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gRXZlbnRFbWl0dGVyIHRvIGxpc3RlbiB0byBkZWZhdWx0IGxhbmcgY2hhbmdlIGV2ZW50c1xyXG4gICAqIG9uRGVmYXVsdExhbmdDaGFuZ2Uuc3Vic2NyaWJlKChwYXJhbXM6IERlZmF1bHRMYW5nQ2hhbmdlRXZlbnQpID0+IHtcclxuICAgICAqICAgICAvLyBkbyBzb21ldGhpbmdcclxuICAgICAqIH0pO1xyXG4gICAqL1xyXG4gIHB1YmxpYyBvbkRlZmF1bHRMYW5nQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RGVmYXVsdExhbmdDaGFuZ2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPERlZmF1bHRMYW5nQ2hhbmdlRXZlbnQ+KCk7XHJcbn1cclxuIl19