import { EventEmitter, Inject, Injectable, InjectionToken } from "@angular/core";
import { concat, forkJoin, isObservable, of, defer } from "rxjs";
import { concatMap, map, shareReplay, switchMap, take } from "rxjs/operators";
import { isDefined, mergeDeep } from "./util";
import * as i0 from "@angular/core";
import * as i1 from "./translate.store";
import * as i2 from "./translate.loader";
import * as i3 from "./translate.compiler";
import * as i4 from "./translate.parser";
import * as i5 from "./missing-translation-handler";
export const USE_STORE = new InjectionToken('USE_STORE');
export const USE_DEFAULT_LANG = new InjectionToken('USE_DEFAULT_LANG');
export const DEFAULT_LANGUAGE = new InjectionToken('DEFAULT_LANGUAGE');
export const USE_EXTEND = new InjectionToken('USE_EXTEND');
export class TranslateService {
    /**
     *
     * @param store an instance of the store (that is supposed to be unique)
     * @param currentLoader An instance of the loader currently used
     * @param compiler An instance of the compiler currently used
     * @param parser An instance of the parser currently used
     * @param missingTranslationHandler A handler for missing translations.
     * @param useDefaultLang whether we should use default language translation when current language translation is missing.
     * @param isolate whether this service should use the store or not
     * @param extend To make a child module extend (and use) translations from parent modules.
     * @param defaultLanguage Set the default language using configuration
     */
    constructor(store, currentLoader, compiler, parser, missingTranslationHandler, useDefaultLang = true, isolate = false, extend = false, defaultLanguage) {
        this.store = store;
        this.currentLoader = currentLoader;
        this.compiler = compiler;
        this.parser = parser;
        this.missingTranslationHandler = missingTranslationHandler;
        this.useDefaultLang = useDefaultLang;
        this.isolate = isolate;
        this.extend = extend;
        this.pending = false;
        this._onTranslationChange = new EventEmitter();
        this._onLangChange = new EventEmitter();
        this._onDefaultLangChange = new EventEmitter();
        this._langs = [];
        this._translations = {};
        this._translationRequests = {};
        /** set the default language from configuration */
        if (defaultLanguage) {
            this.setDefaultLang(defaultLanguage);
        }
    }
    /**
     * An EventEmitter to listen to translation change events
     * onTranslationChange.subscribe((params: TranslationChangeEvent) => {
       *     // do something
       * });
     */
    get onTranslationChange() {
        return this.isolate ? this._onTranslationChange : this.store.onTranslationChange;
    }
    /**
     * An EventEmitter to listen to lang change events
     * onLangChange.subscribe((params: LangChangeEvent) => {
       *     // do something
       * });
     */
    get onLangChange() {
        return this.isolate ? this._onLangChange : this.store.onLangChange;
    }
    /**
     * An EventEmitter to listen to default lang change events
     * onDefaultLangChange.subscribe((params: DefaultLangChangeEvent) => {
       *     // do something
       * });
     */
    get onDefaultLangChange() {
        return this.isolate ? this._onDefaultLangChange : this.store.onDefaultLangChange;
    }
    /**
     * The default lang to fallback when translations are missing on the current lang
     */
    get defaultLang() {
        return this.isolate ? this._defaultLang : this.store.defaultLang;
    }
    set defaultLang(defaultLang) {
        if (this.isolate) {
            this._defaultLang = defaultLang;
        }
        else {
            this.store.defaultLang = defaultLang;
        }
    }
    /**
     * The lang currently used
     */
    get currentLang() {
        return this.isolate ? this._currentLang : this.store.currentLang;
    }
    set currentLang(currentLang) {
        if (this.isolate) {
            this._currentLang = currentLang;
        }
        else {
            this.store.currentLang = currentLang;
        }
    }
    /**
     * an array of langs
     */
    get langs() {
        return this.isolate ? this._langs : this.store.langs;
    }
    set langs(langs) {
        if (this.isolate) {
            this._langs = langs;
        }
        else {
            this.store.langs = langs;
        }
    }
    /**
     * a list of translations per lang
     */
    get translations() {
        return this.isolate ? this._translations : this.store.translations;
    }
    set translations(translations) {
        if (this.isolate) {
            this._translations = translations;
        }
        else {
            this.store.translations = translations;
        }
    }
    /**
     * Sets the default language to use as a fallback
     */
    setDefaultLang(lang) {
        if (lang === this.defaultLang) {
            return;
        }
        let pending = this.retrieveTranslations(lang);
        if (typeof pending !== "undefined") {
            // on init set the defaultLang immediately
            if (this.defaultLang == null) {
                this.defaultLang = lang;
            }
            pending.pipe(take(1))
                .subscribe((res) => {
                this.changeDefaultLang(lang);
            });
        }
        else { // we already have this language
            this.changeDefaultLang(lang);
        }
    }
    /**
     * Gets the default language used
     */
    getDefaultLang() {
        return this.defaultLang;
    }
    /**
     * Changes the lang currently used
     */
    use(lang) {
        // don't change the language if the language given is already selected
        if (lang === this.currentLang) {
            return of(this.translations[lang]);
        }
        let pending = this.retrieveTranslations(lang);
        if (typeof pending !== "undefined") {
            // on init set the currentLang immediately
            if (!this.currentLang) {
                this.currentLang = lang;
            }
            pending.pipe(take(1))
                .subscribe((res) => {
                this.changeLang(lang);
            });
            return pending;
        }
        else { // we have this language, return an Observable
            this.changeLang(lang);
            return of(this.translations[lang]);
        }
    }
    /**
     * Retrieves the given translations
     */
    retrieveTranslations(lang) {
        let pending;
        // if this language is unavailable or extend is true, ask for it
        if (typeof this.translations[lang] === "undefined" || this.extend) {
            this._translationRequests[lang] = this._translationRequests[lang] || this.getTranslation(lang);
            pending = this._translationRequests[lang];
        }
        return pending;
    }
    /**
     * Gets an object of translations for a given language with the current loader
     * and passes it through the compiler
     */
    getTranslation(lang) {
        this.pending = true;
        const loadingTranslations = this.currentLoader.getTranslation(lang).pipe(shareReplay(1), take(1));
        this.loadingTranslations = loadingTranslations.pipe(map((res) => this.compiler.compileTranslations(res, lang)), shareReplay(1), take(1));
        this.loadingTranslations
            .subscribe({
            next: (res) => {
                this.translations[lang] = this.extend && this.translations[lang] ? { ...res, ...this.translations[lang] } : res;
                this.updateLangs();
                this.pending = false;
            },
            error: (err) => {
                this.pending = false;
            }
        });
        return loadingTranslations;
    }
    /**
     * Manually sets an object of translations for a given language
     * after passing it through the compiler
     */
    setTranslation(lang, translations, shouldMerge = false) {
        translations = this.compiler.compileTranslations(translations, lang);
        if ((shouldMerge || this.extend) && this.translations[lang]) {
            this.translations[lang] = mergeDeep(this.translations[lang], translations);
        }
        else {
            this.translations[lang] = translations;
        }
        this.updateLangs();
        this.onTranslationChange.emit({ lang: lang, translations: this.translations[lang] });
    }
    /**
     * Returns an array of currently available langs
     */
    getLangs() {
        return this.langs;
    }
    /**
     * Add available langs
     */
    addLangs(langs) {
        langs.forEach((lang) => {
            if (this.langs.indexOf(lang) === -1) {
                this.langs.push(lang);
            }
        });
    }
    /**
     * Update the list of available langs
     */
    updateLangs() {
        this.addLangs(Object.keys(this.translations));
    }
    /**
     * Returns the parsed result of the translations
     */
    getParsedResult(translations, key, interpolateParams) {
        let res;
        if (key instanceof Array) {
            let result = {}, observables = false;
            for (let k of key) {
                result[k] = this.getParsedResult(translations, k, interpolateParams);
                if (isObservable(result[k])) {
                    observables = true;
                }
            }
            if (observables) {
                const sources = key.map(k => isObservable(result[k]) ? result[k] : of(result[k]));
                return forkJoin(sources).pipe(map((arr) => {
                    let obj = {};
                    arr.forEach((value, index) => {
                        obj[key[index]] = value;
                    });
                    return obj;
                }));
            }
            return result;
        }
        if (translations) {
            res = this.parser.interpolate(this.parser.getValue(translations, key), interpolateParams);
        }
        if (typeof res === "undefined" && this.defaultLang != null && this.defaultLang !== this.currentLang && this.useDefaultLang) {
            res = this.parser.interpolate(this.parser.getValue(this.translations[this.defaultLang], key), interpolateParams);
        }
        if (typeof res === "undefined") {
            let params = { key, translateService: this };
            if (typeof interpolateParams !== 'undefined') {
                params.interpolateParams = interpolateParams;
            }
            res = this.missingTranslationHandler.handle(params);
        }
        return typeof res !== "undefined" ? res : key;
    }
    /**
     * Gets the translated value of a key (or an array of keys)
     * @returns the translated key, or an object of translated keys
     */
    get(key, interpolateParams) {
        if (!isDefined(key) || !key.length) {
            throw new Error(`Parameter "key" required`);
        }
        // check if we are loading a new translation to use
        if (this.pending) {
            return this.loadingTranslations.pipe(concatMap((res) => {
                res = this.getParsedResult(res, key, interpolateParams);
                return isObservable(res) ? res : of(res);
            }));
        }
        else {
            let res = this.getParsedResult(this.translations[this.currentLang], key, interpolateParams);
            return isObservable(res) ? res : of(res);
        }
    }
    /**
     * Returns a stream of translated values of a key (or an array of keys) which updates
     * whenever the translation changes.
     * @returns A stream of the translated key, or an object of translated keys
     */
    getStreamOnTranslationChange(key, interpolateParams) {
        if (!isDefined(key) || !key.length) {
            throw new Error(`Parameter "key" required`);
        }
        return concat(defer(() => this.get(key, interpolateParams)), this.onTranslationChange.pipe(switchMap((event) => {
            const res = this.getParsedResult(event.translations, key, interpolateParams);
            if (typeof res.subscribe === 'function') {
                return res;
            }
            else {
                return of(res);
            }
        })));
    }
    /**
     * Returns a stream of translated values of a key (or an array of keys) which updates
     * whenever the language changes.
     * @returns A stream of the translated key, or an object of translated keys
     */
    stream(key, interpolateParams) {
        if (!isDefined(key) || !key.length) {
            throw new Error(`Parameter "key" required`);
        }
        return concat(defer(() => this.get(key, interpolateParams)), this.onLangChange.pipe(switchMap((event) => {
            const res = this.getParsedResult(event.translations, key, interpolateParams);
            return isObservable(res) ? res : of(res);
        })));
    }
    /**
     * Returns a translation instantly from the internal state of loaded translation.
     * All rules regarding the current language, the preferred language of even fallback languages will be used except any promise handling.
     */
    instant(key, interpolateParams) {
        if (!isDefined(key) || !key.length) {
            throw new Error(`Parameter "key" required`);
        }
        let res = this.getParsedResult(this.translations[this.currentLang], key, interpolateParams);
        if (isObservable(res)) {
            if (key instanceof Array) {
                let obj = {};
                key.forEach((value, index) => {
                    obj[key[index]] = key[index];
                });
                return obj;
            }
            return key;
        }
        else {
            return res;
        }
    }
    /**
     * Sets the translated value of a key, after compiling it
     */
    set(key, value, lang = this.currentLang) {
        this.translations[lang][key] = this.compiler.compile(value, lang);
        this.updateLangs();
        this.onTranslationChange.emit({ lang: lang, translations: this.translations[lang] });
    }
    /**
     * Changes the current lang
     */
    changeLang(lang) {
        this.currentLang = lang;
        this.onLangChange.emit({ lang: lang, translations: this.translations[lang] });
        // if there is no default lang, use the one that we just set
        if (this.defaultLang == null) {
            this.changeDefaultLang(lang);
        }
    }
    /**
     * Changes the default lang
     */
    changeDefaultLang(lang) {
        this.defaultLang = lang;
        this.onDefaultLangChange.emit({ lang: lang, translations: this.translations[lang] });
    }
    /**
     * Allows to reload the lang file from the file
     */
    reloadLang(lang) {
        this.resetLang(lang);
        return this.getTranslation(lang);
    }
    /**
     * Deletes inner translation
     */
    resetLang(lang) {
        this._translationRequests[lang] = undefined;
        this.translations[lang] = undefined;
    }
    /**
     * Returns the language code name from the browser, e.g. "de"
     */
    getBrowserLang() {
        if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
            return undefined;
        }
        let browserLang = window.navigator.languages ? window.navigator.languages[0] : null;
        browserLang = browserLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
        if (typeof browserLang === 'undefined') {
            return undefined;
        }
        if (browserLang.indexOf('-') !== -1) {
            browserLang = browserLang.split('-')[0];
        }
        if (browserLang.indexOf('_') !== -1) {
            browserLang = browserLang.split('_')[0];
        }
        return browserLang;
    }
    /**
     * Returns the culture language code name from the browser, e.g. "de-DE"
     */
    getBrowserCultureLang() {
        if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
            return undefined;
        }
        let browserCultureLang = window.navigator.languages ? window.navigator.languages[0] : null;
        browserCultureLang = browserCultureLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
        return browserCultureLang;
    }
}
TranslateService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: TranslateService, deps: [{ token: i1.TranslateStore }, { token: i2.TranslateLoader }, { token: i3.TranslateCompiler }, { token: i4.TranslateParser }, { token: i5.MissingTranslationHandler }, { token: USE_DEFAULT_LANG }, { token: USE_STORE }, { token: USE_EXTEND }, { token: DEFAULT_LANGUAGE }], target: i0.ɵɵFactoryTarget.Injectable });
TranslateService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: TranslateService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: TranslateService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.TranslateStore }, { type: i2.TranslateLoader }, { type: i3.TranslateCompiler }, { type: i4.TranslateParser }, { type: i5.MissingTranslationHandler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [USE_DEFAULT_LANG]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [USE_STORE]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [USE_EXTEND]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DEFAULT_LANGUAGE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtdHJhbnNsYXRlL2NvcmUvc3JjL2xpYi90cmFuc2xhdGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBYyxFQUFFLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzNFLE9BQU8sRUFBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFPNUUsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7QUFFNUMsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLElBQUksY0FBYyxDQUFTLFdBQVcsQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLElBQUksY0FBYyxDQUFTLGtCQUFrQixDQUFDLENBQUM7QUFDL0UsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxjQUFjLENBQVMsa0JBQWtCLENBQUMsQ0FBQztBQUMvRSxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQVMsWUFBWSxDQUFDLENBQUM7QUF3Qm5FLE1BQU0sT0FBTyxnQkFBZ0I7SUFzRzNCOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsWUFBbUIsS0FBcUIsRUFDckIsYUFBOEIsRUFDOUIsUUFBMkIsRUFDM0IsTUFBdUIsRUFDdkIseUJBQW9ELEVBQ3pCLGlCQUEwQixJQUFJLEVBQ3JDLFVBQW1CLEtBQUssRUFDdkIsU0FBa0IsS0FBSyxFQUN6QixlQUF1QjtRQVIxQyxVQUFLLEdB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LFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNoRyxrQkFBa0IsR0FBRyxrQkFBa0IsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztRQUUxSSxPQUFPLGtCQUFrQixDQUFDO0lBQzVCLENBQUM7OzZHQXRmVSxnQkFBZ0Isd0xBdUhQLGdCQUFnQixhQUNoQixTQUFTLGFBQ1QsVUFBVSxhQUNWLGdCQUFnQjtpSEExSHpCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVOzswQkF3SEksTUFBTTsyQkFBQyxnQkFBZ0I7OzBCQUN2QixNQUFNOzJCQUFDLFNBQVM7OzBCQUNoQixNQUFNOzJCQUFDLFVBQVU7OzBCQUNqQixNQUFNOzJCQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXZlbnRFbWl0dGVyLCBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQge2NvbmNhdCwgZm9ya0pvaW4sIGlzT2JzZXJ2YWJsZSwgT2JzZXJ2YWJsZSwgb2YsIGRlZmVyfSBmcm9tIFwicnhqc1wiO1xyXG5pbXBvcnQge2NvbmNhdE1hcCwgbWFwLCBzaGFyZVJlcGxheSwgc3dpdGNoTWFwLCB0YWtlfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcclxuaW1wb3J0IHtNaXNzaW5nVHJhbnNsYXRpb25IYW5kbGVyLCBNaXNzaW5nVHJhbnNsYXRpb25IYW5kbGVyUGFyYW1zfSBmcm9tIFwiLi9taXNzaW5nLXRyYW5zbGF0aW9uLWhhbmRsZXJcIjtcclxuaW1wb3J0IHtUcmFuc2xhdGVDb21waWxlcn0gZnJvbSBcIi4vdHJhbnNsYXRlLmNvbXBpbGVyXCI7XHJcbmltcG9ydCB7VHJhbnNsYXRlTG9hZGVyfSBmcm9tIFwiLi90cmFuc2xhdGUubG9hZGVyXCI7XHJcbmltcG9ydCB7VHJhbnNsYXRlUGFyc2VyfSBmcm9tIFwiLi90cmFuc2xhdGUucGFyc2VyXCI7XHJcblxyXG5pbXBvcnQge1RyYW5zbGF0ZVN0b3JlfSBmcm9tIFwiLi90cmFuc2xhdGUuc3RvcmVcIjtcclxuaW1wb3J0IHtpc0RlZmluZWQsIG1lcmdlRGVlcH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFVTRV9TVE9SRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdVU0VfU1RPUkUnKTtcclxuZXhwb3J0IGNvbnN0IFVTRV9ERUZBVUxUX0xBTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignVVNFX0RFRkFVTFRfTEFORycpO1xyXG5leHBvcnQgY29uc3QgREVGQVVMVF9MQU5HVUFHRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdERUZBVUxUX0xBTkdVQUdFJyk7XHJcbmV4cG9ydCBjb25zdCBVU0VfRVhURU5EID0gbmV3IEluamVjdGlvblRva2VuPHN0cmluZz4oJ1VTRV9FWFRFTkQnKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRpb25DaGFuZ2VFdmVudCB7XHJcbiAgdHJhbnNsYXRpb25zOiBhbnk7XHJcbiAgbGFuZzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExhbmdDaGFuZ2VFdmVudCB7XHJcbiAgbGFuZzogc3RyaW5nO1xyXG4gIHRyYW5zbGF0aW9uczogYW55O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERlZmF1bHRMYW5nQ2hhbmdlRXZlbnQge1xyXG4gIGxhbmc6IHN0cmluZztcclxuICB0cmFuc2xhdGlvbnM6IGFueTtcclxufVxyXG5cclxuZGVjbGFyZSBpbnRlcmZhY2UgV2luZG93IHtcclxuICBuYXZpZ2F0b3I6IGFueTtcclxufVxyXG5cclxuZGVjbGFyZSBjb25zdCB3aW5kb3c6IFdpbmRvdztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0ZVNlcnZpY2Uge1xyXG4gIHByaXZhdGUgbG9hZGluZ1RyYW5zbGF0aW9ucyE6IE9ic2VydmFibGU8YW55PjtcclxuICBwcml2YXRlIHBlbmRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwcml2YXRlIF9vblRyYW5zbGF0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8VHJhbnNsYXRpb25DaGFuZ2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPFRyYW5zbGF0aW9uQ2hhbmdlRXZlbnQ+KCk7XHJcbiAgcHJpdmF0ZSBfb25MYW5nQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TGFuZ0NoYW5nZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TGFuZ0NoYW5nZUV2ZW50PigpO1xyXG4gIHByaXZhdGUgX29uRGVmYXVsdExhbmdDaGFuZ2U6IEV2ZW50RW1pdHRlcjxEZWZhdWx0TGFuZ0NoYW5nZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8RGVmYXVsdExhbmdDaGFuZ2VFdmVudD4oKTtcclxuICBwcml2YXRlIF9kZWZhdWx0TGFuZyE6IHN0cmluZztcclxuICBwcml2YXRlIF9jdXJyZW50TGFuZyE6IHN0cmluZztcclxuICBwcml2YXRlIF9sYW5nczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gIHByaXZhdGUgX3RyYW5zbGF0aW9uczogYW55ID0ge307XHJcbiAgcHJpdmF0ZSBfdHJhbnNsYXRpb25SZXF1ZXN0czogYW55ID0ge307XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuIEV2ZW50RW1pdHRlciB0byBsaXN0ZW4gdG8gdHJhbnNsYXRpb24gY2hhbmdlIGV2ZW50c1xyXG4gICAqIG9uVHJhbnNsYXRpb25DaGFuZ2Uuc3Vic2NyaWJlKChwYXJhbXM6IFRyYW5zbGF0aW9uQ2hhbmdlRXZlbnQpID0+IHtcclxuICAgICAqICAgICAvLyBkbyBzb21ldGhpbmdcclxuICAgICAqIH0pO1xyXG4gICAqL1xyXG4gIGdldCBvblRyYW5zbGF0aW9uQ2hhbmdlKCk6IEV2ZW50RW1pdHRlcjxUcmFuc2xhdGlvbkNoYW5nZUV2ZW50PiB7XHJcbiAgICByZXR1cm4gdGhpcy5pc29sYXRlID8gdGhpcy5fb25UcmFuc2xhdGlvbkNoYW5nZSA6IHRoaXMuc3RvcmUub25UcmFuc2xhdGlvbkNoYW5nZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuIEV2ZW50RW1pdHRlciB0byBsaXN0ZW4gdG8gbGFuZyBjaGFuZ2UgZXZlbnRzXHJcbiAgICogb25MYW5nQ2hhbmdlLnN1YnNjcmliZSgocGFyYW1zOiBMYW5nQ2hhbmdlRXZlbnQpID0+IHtcclxuICAgICAqICAgICAvLyBkbyBzb21ldGhpbmdcclxuICAgICAqIH0pO1xyXG4gICAqL1xyXG4gIGdldCBvbkxhbmdDaGFuZ2UoKTogRXZlbnRFbWl0dGVyPExhbmdDaGFuZ2VFdmVudD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNvbGF0ZSA/IHRoaXMuX29uTGFuZ0NoYW5nZSA6IHRoaXMuc3RvcmUub25MYW5nQ2hhbmdlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQW4gRXZlbnRFbWl0dGVyIHRvIGxpc3RlbiB0byBkZWZhdWx0IGxhbmcgY2hhbmdlIGV2ZW50c1xyXG4gICAqIG9uRGVmYXVsdExhbmdDaGFuZ2Uuc3Vic2NyaWJlKChwYXJhbXM6IERlZmF1bHRMYW5nQ2hhbmdlRXZlbnQpID0+IHtcclxuICAgICAqICAgICAvLyBkbyBzb21ldGhpbmdcclxuICAgICAqIH0pO1xyXG4gICAqL1xyXG4gIGdldCBvbkRlZmF1bHRMYW5nQ2hhbmdlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNvbGF0ZSA/IHRoaXMuX29uRGVmYXVsdExhbmdDaGFuZ2UgOiB0aGlzLnN0b3JlLm9uRGVmYXVsdExhbmdDaGFuZ2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgZGVmYXVsdCBsYW5nIHRvIGZhbGxiYWNrIHdoZW4gdHJhbnNsYXRpb25zIGFyZSBtaXNzaW5nIG9uIHRoZSBjdXJyZW50IGxhbmdcclxuICAgKi9cclxuICBnZXQgZGVmYXVsdExhbmcoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmlzb2xhdGUgPyB0aGlzLl9kZWZhdWx0TGFuZyA6IHRoaXMuc3RvcmUuZGVmYXVsdExhbmc7XHJcbiAgfVxyXG5cclxuICBzZXQgZGVmYXVsdExhbmcoZGVmYXVsdExhbmc6IHN0cmluZykge1xyXG4gICAgaWYgKHRoaXMuaXNvbGF0ZSkge1xyXG4gICAgICB0aGlzLl9kZWZhdWx0TGFuZyA9IGRlZmF1bHRMYW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdG9yZS5kZWZhdWx0TGFuZyA9IGRlZmF1bHRMYW5nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGxhbmcgY3VycmVudGx5IHVzZWRcclxuICAgKi9cclxuICBnZXQgY3VycmVudExhbmcoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmlzb2xhdGUgPyB0aGlzLl9jdXJyZW50TGFuZyA6IHRoaXMuc3RvcmUuY3VycmVudExhbmc7XHJcbiAgfVxyXG5cclxuICBzZXQgY3VycmVudExhbmcoY3VycmVudExhbmc6IHN0cmluZykge1xyXG4gICAgaWYgKHRoaXMuaXNvbGF0ZSkge1xyXG4gICAgICB0aGlzLl9jdXJyZW50TGFuZyA9IGN1cnJlbnRMYW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdG9yZS5jdXJyZW50TGFuZyA9IGN1cnJlbnRMYW5nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYW4gYXJyYXkgb2YgbGFuZ3NcclxuICAgKi9cclxuICBnZXQgbGFuZ3MoKTogc3RyaW5nW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNvbGF0ZSA/IHRoaXMuX2xhbmdzIDogdGhpcy5zdG9yZS5sYW5ncztcclxuICB9XHJcblxyXG4gIHNldCBsYW5ncyhsYW5nczogc3RyaW5nW10pIHtcclxuICAgIGlmICh0aGlzLmlzb2xhdGUpIHtcclxuICAgICAgdGhpcy5fbGFuZ3MgPSBsYW5ncztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3RvcmUubGFuZ3MgPSBsYW5ncztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGEgbGlzdCBvZiB0cmFuc2xhdGlvbnMgcGVyIGxhbmdcclxuICAgKi9cclxuICBnZXQgdHJhbnNsYXRpb25zKCk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5pc29sYXRlID8gdGhpcy5fdHJhbnNsYXRpb25zIDogdGhpcy5zdG9yZS50cmFuc2xhdGlvbnM7XHJcbiAgfVxyXG5cclxuICBzZXQgdHJhbnNsYXRpb25zKHRyYW5zbGF0aW9uczogYW55KSB7XHJcbiAgICBpZiAodGhpcy5pc29sYXRlKSB7XHJcbiAgICAgIHRoaXMuX3RyYW5zbGF0aW9ucyA9IHRyYW5zbGF0aW9ucztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3RvcmUudHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RvcmUgYW4gaW5zdGFuY2Ugb2YgdGhlIHN0b3JlICh0aGF0IGlzIHN1cHBvc2VkIHRvIGJlIHVuaXF1ZSlcclxuICAgKiBAcGFyYW0gY3VycmVudExvYWRlciBBbiBpbnN0YW5jZSBvZiB0aGUgbG9hZGVyIGN1cnJlbnRseSB1c2VkXHJcbiAgICogQHBhcmFtIGNvbXBpbGVyIEFuIGluc3RhbmNlIG9mIHRoZSBjb21waWxlciBjdXJyZW50bHkgdXNlZFxyXG4gICAqIEBwYXJhbSBwYXJzZXIgQW4gaW5zdGFuY2Ugb2YgdGhlIHBhcnNlciBjdXJyZW50bHkgdXNlZFxyXG4gICAqIEBwYXJhbSBtaXNzaW5nVHJhbnNsYXRpb25IYW5kbGVyIEEgaGFuZGxlciBmb3IgbWlzc2luZyB0cmFuc2xhdGlvbnMuXHJcbiAgICogQHBhcmFtIHVzZURlZmF1bHRMYW5nIHdoZXRoZXIgd2Ugc2hvdWxkIHVzZSBkZWZhdWx0IGxhbmd1YWdlIHRyYW5zbGF0aW9uIHdoZW4gY3VycmVudCBsYW5ndWFnZSB0cmFuc2xhdGlvbiBpcyBtaXNzaW5nLlxyXG4gICAqIEBwYXJhbSBpc29sYXRlIHdoZXRoZXIgdGhpcyBzZXJ2aWNlIHNob3VsZCB1c2UgdGhlIHN0b3JlIG9yIG5vdFxyXG4gICAqIEBwYXJhbSBleHRlbmQgVG8gbWFrZSBhIGNoaWxkIG1vZHVsZSBleHRlbmQgKGFuZCB1c2UpIHRyYW5zbGF0aW9ucyBmcm9tIHBhcmVudCBtb2R1bGVzLlxyXG4gICAqIEBwYXJhbSBkZWZhdWx0TGFuZ3VhZ2UgU2V0IHRoZSBkZWZhdWx0IGxhbmd1YWdlIHVzaW5nIGNvbmZpZ3VyYXRpb25cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RvcmU6IFRyYW5zbGF0ZVN0b3JlLFxyXG4gICAgICAgICAgICAgIHB1YmxpYyBjdXJyZW50TG9hZGVyOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgICAgICAgcHVibGljIGNvbXBpbGVyOiBUcmFuc2xhdGVDb21waWxlcixcclxuICAgICAgICAgICAgICBwdWJsaWMgcGFyc2VyOiBUcmFuc2xhdGVQYXJzZXIsXHJcbiAgICAgICAgICAgICAgcHVibGljIG1pc3NpbmdUcmFuc2xhdGlvbkhhbmRsZXI6IE1pc3NpbmdUcmFuc2xhdGlvbkhhbmRsZXIsXHJcbiAgICAgICAgICAgICAgQEluamVjdChVU0VfREVGQVVMVF9MQU5HKSBwcml2YXRlIHVzZURlZmF1bHRMYW5nOiBib29sZWFuID0gdHJ1ZSxcclxuICAgICAgICAgICAgICBASW5qZWN0KFVTRV9TVE9SRSkgcHJpdmF0ZSBpc29sYXRlOiBib29sZWFuID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgQEluamVjdChVU0VfRVhURU5EKSBwcml2YXRlIGV4dGVuZDogYm9vbGVhbiA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgIEBJbmplY3QoREVGQVVMVF9MQU5HVUFHRSkgZGVmYXVsdExhbmd1YWdlOiBzdHJpbmcpIHtcclxuICAgIC8qKiBzZXQgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UgZnJvbSBjb25maWd1cmF0aW9uICovXHJcbiAgICBpZiAoZGVmYXVsdExhbmd1YWdlKSB7XHJcbiAgICAgIHRoaXMuc2V0RGVmYXVsdExhbmcoZGVmYXVsdExhbmd1YWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UgdG8gdXNlIGFzIGEgZmFsbGJhY2tcclxuICAgKi9cclxuICBwdWJsaWMgc2V0RGVmYXVsdExhbmcobGFuZzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBpZiAobGFuZyA9PT0gdGhpcy5kZWZhdWx0TGFuZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHBlbmRpbmcgPSB0aGlzLnJldHJpZXZlVHJhbnNsYXRpb25zKGxhbmcpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgcGVuZGluZyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAvLyBvbiBpbml0IHNldCB0aGUgZGVmYXVsdExhbmcgaW1tZWRpYXRlbHlcclxuICAgICAgaWYgKHRoaXMuZGVmYXVsdExhbmcgPT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdExhbmcgPSBsYW5nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBwZW5kaW5nLnBpcGUodGFrZSgxKSlcclxuICAgICAgICAuc3Vic2NyaWJlKChyZXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VEZWZhdWx0TGFuZyhsYW5nKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7IC8vIHdlIGFscmVhZHkgaGF2ZSB0aGlzIGxhbmd1YWdlXHJcbiAgICAgIHRoaXMuY2hhbmdlRGVmYXVsdExhbmcobGFuZyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBkZWZhdWx0IGxhbmd1YWdlIHVzZWRcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0RGVmYXVsdExhbmcoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmRlZmF1bHRMYW5nO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hhbmdlcyB0aGUgbGFuZyBjdXJyZW50bHkgdXNlZFxyXG4gICAqL1xyXG4gIHB1YmxpYyB1c2UobGFuZzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIC8vIGRvbid0IGNoYW5nZSB0aGUgbGFuZ3VhZ2UgaWYgdGhlIGxhbmd1YWdlIGdpdmVuIGlzIGFscmVhZHkgc2VsZWN0ZWRcclxuICAgIGlmIChsYW5nID09PSB0aGlzLmN1cnJlbnRMYW5nKSB7XHJcbiAgICAgIHJldHVybiBvZih0aGlzLnRyYW5zbGF0aW9uc1tsYW5nXSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHBlbmRpbmcgPSB0aGlzLnJldHJpZXZlVHJhbnNsYXRpb25zKGxhbmcpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgcGVuZGluZyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAvLyBvbiBpbml0IHNldCB0aGUgY3VycmVudExhbmcgaW1tZWRpYXRlbHlcclxuICAgICAgaWYgKCF0aGlzLmN1cnJlbnRMYW5nKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TGFuZyA9IGxhbmc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBlbmRpbmcucGlwZSh0YWtlKDEpKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoKHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZUxhbmcobGFuZyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gcGVuZGluZztcclxuICAgIH0gZWxzZSB7IC8vIHdlIGhhdmUgdGhpcyBsYW5ndWFnZSwgcmV0dXJuIGFuIE9ic2VydmFibGVcclxuICAgICAgdGhpcy5jaGFuZ2VMYW5nKGxhbmcpO1xyXG5cclxuICAgICAgcmV0dXJuIG9mKHRoaXMudHJhbnNsYXRpb25zW2xhbmddKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyB0aGUgZ2l2ZW4gdHJhbnNsYXRpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZXRyaWV2ZVRyYW5zbGF0aW9ucyhsYW5nOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4gfCB1bmRlZmluZWQge1xyXG4gICAgbGV0IHBlbmRpbmc6IE9ic2VydmFibGU8YW55PiB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvLyBpZiB0aGlzIGxhbmd1YWdlIGlzIHVuYXZhaWxhYmxlIG9yIGV4dGVuZCBpcyB0cnVlLCBhc2sgZm9yIGl0XHJcbiAgICBpZiAodHlwZW9mIHRoaXMudHJhbnNsYXRpb25zW2xhbmddID09PSBcInVuZGVmaW5lZFwiIHx8IHRoaXMuZXh0ZW5kKSB7XHJcbiAgICAgIHRoaXMuX3RyYW5zbGF0aW9uUmVxdWVzdHNbbGFuZ10gPSB0aGlzLl90cmFuc2xhdGlvblJlcXVlc3RzW2xhbmddIHx8IHRoaXMuZ2V0VHJhbnNsYXRpb24obGFuZyk7XHJcbiAgICAgIHBlbmRpbmcgPSB0aGlzLl90cmFuc2xhdGlvblJlcXVlc3RzW2xhbmddO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwZW5kaW5nO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyBhbiBvYmplY3Qgb2YgdHJhbnNsYXRpb25zIGZvciBhIGdpdmVuIGxhbmd1YWdlIHdpdGggdGhlIGN1cnJlbnQgbG9hZGVyXHJcbiAgICogYW5kIHBhc3NlcyBpdCB0aHJvdWdoIHRoZSBjb21waWxlclxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRUcmFuc2xhdGlvbihsYW5nOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgdGhpcy5wZW5kaW5nID0gdHJ1ZTtcclxuICAgIGNvbnN0IGxvYWRpbmdUcmFuc2xhdGlvbnMgPSB0aGlzLmN1cnJlbnRMb2FkZXIuZ2V0VHJhbnNsYXRpb24obGFuZykucGlwZShcclxuICAgICAgc2hhcmVSZXBsYXkoMSksXHJcbiAgICAgIHRha2UoMSksXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMubG9hZGluZ1RyYW5zbGF0aW9ucyA9IGxvYWRpbmdUcmFuc2xhdGlvbnMucGlwZShcclxuICAgICAgbWFwKChyZXM6IE9iamVjdCkgPT4gdGhpcy5jb21waWxlci5jb21waWxlVHJhbnNsYXRpb25zKHJlcywgbGFuZykpLFxyXG4gICAgICBzaGFyZVJlcGxheSgxKSxcclxuICAgICAgdGFrZSgxKSxcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5sb2FkaW5nVHJhbnNsYXRpb25zXHJcbiAgICAgIC5zdWJzY3JpYmUoe1xyXG4gICAgICAgIG5leHQ6IChyZXM6IE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy50cmFuc2xhdGlvbnNbbGFuZ10gPSB0aGlzLmV4dGVuZCAmJiB0aGlzLnRyYW5zbGF0aW9uc1tsYW5nXSA/IHsgLi4ucmVzLCAuLi50aGlzLnRyYW5zbGF0aW9uc1tsYW5nXSB9IDogcmVzO1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVMYW5ncygpO1xyXG4gICAgICAgICAgdGhpcy5wZW5kaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvcjogKGVycjogYW55KSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBsb2FkaW5nVHJhbnNsYXRpb25zO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFudWFsbHkgc2V0cyBhbiBvYmplY3Qgb2YgdHJhbnNsYXRpb25zIGZvciBhIGdpdmVuIGxhbmd1YWdlXHJcbiAgICogYWZ0ZXIgcGFzc2luZyBpdCB0aHJvdWdoIHRoZSBjb21waWxlclxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZXRUcmFuc2xhdGlvbihsYW5nOiBzdHJpbmcsIHRyYW5zbGF0aW9uczogT2JqZWN0LCBzaG91bGRNZXJnZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICB0cmFuc2xhdGlvbnMgPSB0aGlzLmNvbXBpbGVyLmNvbXBpbGVUcmFuc2xhdGlvbnModHJhbnNsYXRpb25zLCBsYW5nKTtcclxuICAgIGlmICgoc2hvdWxkTWVyZ2UgfHwgdGhpcy5leHRlbmQpICYmIHRoaXMudHJhbnNsYXRpb25zW2xhbmddKSB7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRpb25zW2xhbmddID0gbWVyZ2VEZWVwKHRoaXMudHJhbnNsYXRpb25zW2xhbmddLCB0cmFuc2xhdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50cmFuc2xhdGlvbnNbbGFuZ10gPSB0cmFuc2xhdGlvbnM7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZUxhbmdzKCk7XHJcbiAgICB0aGlzLm9uVHJhbnNsYXRpb25DaGFuZ2UuZW1pdCh7bGFuZzogbGFuZywgdHJhbnNsYXRpb25zOiB0aGlzLnRyYW5zbGF0aW9uc1tsYW5nXX0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBjdXJyZW50bHkgYXZhaWxhYmxlIGxhbmdzXHJcbiAgICovXHJcbiAgcHVibGljIGdldExhbmdzKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGFuZ3M7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgYXZhaWxhYmxlIGxhbmdzXHJcbiAgICovXHJcbiAgcHVibGljIGFkZExhbmdzKGxhbmdzOiBBcnJheTxzdHJpbmc+KTogdm9pZCB7XHJcbiAgICBsYW5ncy5mb3JFYWNoKChsYW5nOiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYgKHRoaXMubGFuZ3MuaW5kZXhPZihsYW5nKSA9PT0gLTEpIHtcclxuICAgICAgICB0aGlzLmxhbmdzLnB1c2gobGFuZyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBsaXN0IG9mIGF2YWlsYWJsZSBsYW5nc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgdXBkYXRlTGFuZ3MoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFkZExhbmdzKE9iamVjdC5rZXlzKHRoaXMudHJhbnNsYXRpb25zKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBwYXJzZWQgcmVzdWx0IG9mIHRoZSB0cmFuc2xhdGlvbnNcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0UGFyc2VkUmVzdWx0KHRyYW5zbGF0aW9uczogYW55LCBrZXk6IGFueSwgaW50ZXJwb2xhdGVQYXJhbXM/OiBPYmplY3QpOiBhbnkge1xyXG4gICAgbGV0IHJlczogc3RyaW5nIHwgT2JzZXJ2YWJsZTxzdHJpbmc+IHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGlmIChrZXkgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICBsZXQgcmVzdWx0OiBhbnkgPSB7fSxcclxuICAgICAgICBvYnNlcnZhYmxlczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICBmb3IgKGxldCBrIG9mIGtleSkge1xyXG4gICAgICAgIHJlc3VsdFtrXSA9IHRoaXMuZ2V0UGFyc2VkUmVzdWx0KHRyYW5zbGF0aW9ucywgaywgaW50ZXJwb2xhdGVQYXJhbXMpO1xyXG4gICAgICAgIGlmIChpc09ic2VydmFibGUocmVzdWx0W2tdKSkge1xyXG4gICAgICAgICAgb2JzZXJ2YWJsZXMgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAob2JzZXJ2YWJsZXMpIHtcclxuICAgICAgICBjb25zdCBzb3VyY2VzID0ga2V5Lm1hcChrID0+IGlzT2JzZXJ2YWJsZShyZXN1bHRba10pID8gcmVzdWx0W2tdIDogb2YocmVzdWx0W2tdIGFzIHN0cmluZykpO1xyXG4gICAgICAgIHJldHVybiBmb3JrSm9pbihzb3VyY2VzKS5waXBlKFxyXG4gICAgICAgICAgbWFwKChhcnI6IEFycmF5PHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgbGV0IG9iajogYW55ID0ge307XHJcbiAgICAgICAgICAgIGFyci5mb3JFYWNoKCh2YWx1ZTogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgb2JqW2tleVtpbmRleF1dID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRyYW5zbGF0aW9ucykge1xyXG4gICAgICByZXMgPSB0aGlzLnBhcnNlci5pbnRlcnBvbGF0ZSh0aGlzLnBhcnNlci5nZXRWYWx1ZSh0cmFuc2xhdGlvbnMsIGtleSksIGludGVycG9sYXRlUGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHJlcyA9PT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLmRlZmF1bHRMYW5nICE9IG51bGwgJiYgdGhpcy5kZWZhdWx0TGFuZyAhPT0gdGhpcy5jdXJyZW50TGFuZyAmJiB0aGlzLnVzZURlZmF1bHRMYW5nKSB7XHJcbiAgICAgIHJlcyA9IHRoaXMucGFyc2VyLmludGVycG9sYXRlKHRoaXMucGFyc2VyLmdldFZhbHVlKHRoaXMudHJhbnNsYXRpb25zW3RoaXMuZGVmYXVsdExhbmddLCBrZXkpLCBpbnRlcnBvbGF0ZVBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiByZXMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgbGV0IHBhcmFtczogTWlzc2luZ1RyYW5zbGF0aW9uSGFuZGxlclBhcmFtcyA9IHtrZXksIHRyYW5zbGF0ZVNlcnZpY2U6IHRoaXN9O1xyXG4gICAgICBpZiAodHlwZW9mIGludGVycG9sYXRlUGFyYW1zICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHBhcmFtcy5pbnRlcnBvbGF0ZVBhcmFtcyA9IGludGVycG9sYXRlUGFyYW1zO1xyXG4gICAgICB9XHJcbiAgICAgIHJlcyA9IHRoaXMubWlzc2luZ1RyYW5zbGF0aW9uSGFuZGxlci5oYW5kbGUocGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHlwZW9mIHJlcyAhPT0gXCJ1bmRlZmluZWRcIiA/IHJlcyA6IGtleTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHRyYW5zbGF0ZWQgdmFsdWUgb2YgYSBrZXkgKG9yIGFuIGFycmF5IG9mIGtleXMpXHJcbiAgICogQHJldHVybnMgdGhlIHRyYW5zbGF0ZWQga2V5LCBvciBhbiBvYmplY3Qgb2YgdHJhbnNsYXRlZCBrZXlzXHJcbiAgICovXHJcbiAgcHVibGljIGdldChrZXk6IHN0cmluZyB8IEFycmF5PHN0cmluZz4sIGludGVycG9sYXRlUGFyYW1zPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxzdHJpbmcgfCBhbnk+IHtcclxuICAgIGlmICghaXNEZWZpbmVkKGtleSkgfHwgIWtleS5sZW5ndGgpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQYXJhbWV0ZXIgXCJrZXlcIiByZXF1aXJlZGApO1xyXG4gICAgfVxyXG4gICAgLy8gY2hlY2sgaWYgd2UgYXJlIGxvYWRpbmcgYSBuZXcgdHJhbnNsYXRpb24gdG8gdXNlXHJcbiAgICBpZiAodGhpcy5wZW5kaW5nKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmxvYWRpbmdUcmFuc2xhdGlvbnMucGlwZShcclxuICAgICAgICBjb25jYXRNYXAoKHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgICByZXMgPSB0aGlzLmdldFBhcnNlZFJlc3VsdChyZXMsIGtleSwgaW50ZXJwb2xhdGVQYXJhbXMpO1xyXG4gICAgICAgICAgcmV0dXJuIGlzT2JzZXJ2YWJsZShyZXMpID8gcmVzIDogb2YocmVzKTtcclxuICAgICAgICB9KSxcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCByZXMgPSB0aGlzLmdldFBhcnNlZFJlc3VsdCh0aGlzLnRyYW5zbGF0aW9uc1t0aGlzLmN1cnJlbnRMYW5nXSwga2V5LCBpbnRlcnBvbGF0ZVBhcmFtcyk7XHJcbiAgICAgIHJldHVybiBpc09ic2VydmFibGUocmVzKSA/IHJlcyA6IG9mKHJlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgc3RyZWFtIG9mIHRyYW5zbGF0ZWQgdmFsdWVzIG9mIGEga2V5IChvciBhbiBhcnJheSBvZiBrZXlzKSB3aGljaCB1cGRhdGVzXHJcbiAgICogd2hlbmV2ZXIgdGhlIHRyYW5zbGF0aW9uIGNoYW5nZXMuXHJcbiAgICogQHJldHVybnMgQSBzdHJlYW0gb2YgdGhlIHRyYW5zbGF0ZWQga2V5LCBvciBhbiBvYmplY3Qgb2YgdHJhbnNsYXRlZCBrZXlzXHJcbiAgICovXHJcbiAgcHVibGljIGdldFN0cmVhbU9uVHJhbnNsYXRpb25DaGFuZ2Uoa2V5OiBzdHJpbmcgfCBBcnJheTxzdHJpbmc+LCBpbnRlcnBvbGF0ZVBhcmFtcz86IE9iamVjdCk6IE9ic2VydmFibGU8c3RyaW5nIHwgYW55PiB7XHJcbiAgICBpZiAoIWlzRGVmaW5lZChrZXkpIHx8ICFrZXkubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGFyYW1ldGVyIFwia2V5XCIgcmVxdWlyZWRgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY29uY2F0KFxyXG4gICAgICBkZWZlcigoKSA9PiB0aGlzLmdldChrZXksIGludGVycG9sYXRlUGFyYW1zKSksXHJcbiAgICAgIHRoaXMub25UcmFuc2xhdGlvbkNoYW5nZS5waXBlKFxyXG4gICAgICAgIHN3aXRjaE1hcCgoZXZlbnQ6IFRyYW5zbGF0aW9uQ2hhbmdlRXZlbnQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHJlcyA9IHRoaXMuZ2V0UGFyc2VkUmVzdWx0KGV2ZW50LnRyYW5zbGF0aW9ucywga2V5LCBpbnRlcnBvbGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHJlcy5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvZihyZXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgc3RyZWFtIG9mIHRyYW5zbGF0ZWQgdmFsdWVzIG9mIGEga2V5IChvciBhbiBhcnJheSBvZiBrZXlzKSB3aGljaCB1cGRhdGVzXHJcbiAgICogd2hlbmV2ZXIgdGhlIGxhbmd1YWdlIGNoYW5nZXMuXHJcbiAgICogQHJldHVybnMgQSBzdHJlYW0gb2YgdGhlIHRyYW5zbGF0ZWQga2V5LCBvciBhbiBvYmplY3Qgb2YgdHJhbnNsYXRlZCBrZXlzXHJcbiAgICovXHJcbiAgcHVibGljIHN0cmVhbShrZXk6IHN0cmluZyB8IEFycmF5PHN0cmluZz4sIGludGVycG9sYXRlUGFyYW1zPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxzdHJpbmcgfCBhbnk+IHtcclxuICAgIGlmICghaXNEZWZpbmVkKGtleSkgfHwgIWtleS5sZW5ndGgpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQYXJhbWV0ZXIgXCJrZXlcIiByZXF1aXJlZGApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb25jYXQoXHJcbiAgICAgIGRlZmVyKCgpID0+IHRoaXMuZ2V0KGtleSwgaW50ZXJwb2xhdGVQYXJhbXMpKSxcclxuICAgICAgdGhpcy5vbkxhbmdDaGFuZ2UucGlwZShcclxuICAgICAgICBzd2l0Y2hNYXAoKGV2ZW50OiBMYW5nQ2hhbmdlRXZlbnQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHJlcyA9IHRoaXMuZ2V0UGFyc2VkUmVzdWx0KGV2ZW50LnRyYW5zbGF0aW9ucywga2V5LCBpbnRlcnBvbGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgICByZXR1cm4gaXNPYnNlcnZhYmxlKHJlcykgPyByZXMgOiBvZihyZXMpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHRyYW5zbGF0aW9uIGluc3RhbnRseSBmcm9tIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiBsb2FkZWQgdHJhbnNsYXRpb24uXHJcbiAgICogQWxsIHJ1bGVzIHJlZ2FyZGluZyB0aGUgY3VycmVudCBsYW5ndWFnZSwgdGhlIHByZWZlcnJlZCBsYW5ndWFnZSBvZiBldmVuIGZhbGxiYWNrIGxhbmd1YWdlcyB3aWxsIGJlIHVzZWQgZXhjZXB0IGFueSBwcm9taXNlIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBpbnN0YW50KGtleTogc3RyaW5nIHwgQXJyYXk8c3RyaW5nPiwgaW50ZXJwb2xhdGVQYXJhbXM/OiBPYmplY3QpOiBzdHJpbmcgfCBhbnkge1xyXG4gICAgaWYgKCFpc0RlZmluZWQoa2V5KSB8fCAha2V5Lmxlbmd0aCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFBhcmFtZXRlciBcImtleVwiIHJlcXVpcmVkYCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlcyA9IHRoaXMuZ2V0UGFyc2VkUmVzdWx0KHRoaXMudHJhbnNsYXRpb25zW3RoaXMuY3VycmVudExhbmddLCBrZXksIGludGVycG9sYXRlUGFyYW1zKTtcclxuICAgIGlmIChpc09ic2VydmFibGUocmVzKSkge1xyXG4gICAgICBpZiAoa2V5IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICBsZXQgb2JqOiBhbnkgPSB7fTtcclxuICAgICAgICBrZXkuZm9yRWFjaCgodmFsdWU6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgb2JqW2tleVtpbmRleF1dID0ga2V5W2luZGV4XTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBrZXk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgdHJhbnNsYXRlZCB2YWx1ZSBvZiBhIGtleSwgYWZ0ZXIgY29tcGlsaW5nIGl0XHJcbiAgICovXHJcbiAgcHVibGljIHNldChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGFuZzogc3RyaW5nID0gdGhpcy5jdXJyZW50TGFuZyk6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2xhdGlvbnNbbGFuZ11ba2V5XSA9IHRoaXMuY29tcGlsZXIuY29tcGlsZSh2YWx1ZSwgbGFuZyk7XHJcbiAgICB0aGlzLnVwZGF0ZUxhbmdzKCk7XHJcbiAgICB0aGlzLm9uVHJhbnNsYXRpb25DaGFuZ2UuZW1pdCh7bGFuZzogbGFuZywgdHJhbnNsYXRpb25zOiB0aGlzLnRyYW5zbGF0aW9uc1tsYW5nXX0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hhbmdlcyB0aGUgY3VycmVudCBsYW5nXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjaGFuZ2VMYW5nKGxhbmc6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5jdXJyZW50TGFuZyA9IGxhbmc7XHJcbiAgICB0aGlzLm9uTGFuZ0NoYW5nZS5lbWl0KHtsYW5nOiBsYW5nLCB0cmFuc2xhdGlvbnM6IHRoaXMudHJhbnNsYXRpb25zW2xhbmddfSk7XHJcblxyXG4gICAgLy8gaWYgdGhlcmUgaXMgbm8gZGVmYXVsdCBsYW5nLCB1c2UgdGhlIG9uZSB0aGF0IHdlIGp1c3Qgc2V0XHJcbiAgICBpZiAodGhpcy5kZWZhdWx0TGFuZyA9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlRGVmYXVsdExhbmcobGFuZyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGFuZ2VzIHRoZSBkZWZhdWx0IGxhbmdcclxuICAgKi9cclxuICBwcml2YXRlIGNoYW5nZURlZmF1bHRMYW5nKGxhbmc6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5kZWZhdWx0TGFuZyA9IGxhbmc7XHJcbiAgICB0aGlzLm9uRGVmYXVsdExhbmdDaGFuZ2UuZW1pdCh7bGFuZzogbGFuZywgdHJhbnNsYXRpb25zOiB0aGlzLnRyYW5zbGF0aW9uc1tsYW5nXX0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWxsb3dzIHRvIHJlbG9hZCB0aGUgbGFuZyBmaWxlIGZyb20gdGhlIGZpbGVcclxuICAgKi9cclxuICBwdWJsaWMgcmVsb2FkTGFuZyhsYW5nOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgdGhpcy5yZXNldExhbmcobGFuZyk7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRUcmFuc2xhdGlvbihsYW5nKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlbGV0ZXMgaW5uZXIgdHJhbnNsYXRpb25cclxuICAgKi9cclxuICBwdWJsaWMgcmVzZXRMYW5nKGxhbmc6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5fdHJhbnNsYXRpb25SZXF1ZXN0c1tsYW5nXSA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMudHJhbnNsYXRpb25zW2xhbmddID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbGFuZ3VhZ2UgY29kZSBuYW1lIGZyb20gdGhlIGJyb3dzZXIsIGUuZy4gXCJkZVwiXHJcbiAgICovXHJcbiAgcHVibGljIGdldEJyb3dzZXJMYW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3IgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGJyb3dzZXJMYW5nOiBhbnkgPSB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlcyA/IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdIDogbnVsbDtcclxuICAgIGJyb3dzZXJMYW5nID0gYnJvd3NlckxhbmcgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZSB8fCB3aW5kb3cubmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJMYW5ndWFnZTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGJyb3dzZXJMYW5nID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJyb3dzZXJMYW5nLmluZGV4T2YoJy0nKSAhPT0gLTEpIHtcclxuICAgICAgYnJvd3NlckxhbmcgPSBicm93c2VyTGFuZy5zcGxpdCgnLScpWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChicm93c2VyTGFuZy5pbmRleE9mKCdfJykgIT09IC0xKSB7XHJcbiAgICAgIGJyb3dzZXJMYW5nID0gYnJvd3Nlckxhbmcuc3BsaXQoJ18nKVswXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnJvd3Nlckxhbmc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBjdWx0dXJlIGxhbmd1YWdlIGNvZGUgbmFtZSBmcm9tIHRoZSBicm93c2VyLCBlLmcuIFwiZGUtREVcIlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRCcm93c2VyQ3VsdHVyZUxhbmcoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93Lm5hdmlnYXRvciA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYnJvd3NlckN1bHR1cmVMYW5nOiBhbnkgPSB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlcyA/IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdIDogbnVsbDtcclxuICAgIGJyb3dzZXJDdWx0dXJlTGFuZyA9IGJyb3dzZXJDdWx0dXJlTGFuZyB8fCB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlO1xyXG5cclxuICAgIHJldHVybiBicm93c2VyQ3VsdHVyZUxhbmc7XHJcbiAgfVxyXG59XHJcbiJdfQ==