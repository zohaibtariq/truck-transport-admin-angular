/**
 * @license Angular v13.1.0-next.2
 * (c) 2010-2021 Google LLC. https://angular.io/
 * License: MIT
 */

import { BehaviorSubject } from 'rxjs';
import { HttpBackend } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { HttpXhrBackend } from '@angular/common/http';
import * as i0 from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';
import { Type } from '@angular/core';
import { XhrFactory } from '@angular/common';

/**
 * Base class for in-memory web api back-ends
 * Simulate the behavior of a RESTy web api
 * backed by the simple in-memory data store provided by the injected `InMemoryDbService` service.
 * Conforms mostly to behavior described here:
 * http://www.restapitutorial.com/lessons/httpmethods.html
 */
export declare abstract class BackendService {
    protected inMemDbService: InMemoryDbService;
    protected config: InMemoryBackendConfigArgs;
    protected db: {
        [key: string]: any;
    };
    protected dbReadySubject: BehaviorSubject<boolean> | undefined;
    private passThruBackend;
    protected requestInfoUtils: RequestInfoUtilities;
    constructor(inMemDbService: InMemoryDbService, config?: InMemoryBackendConfigArgs);
    protected get dbReady(): Observable<boolean>;
    /**
     * Process Request and return an Observable of Http Response object
     * in the manner of a RESTy web api.
     *
     * Expect URI pattern in the form :base/:collectionName/:id?
     * Examples:
     *   // for store with a 'customers' collection
     *   GET api/customers          // all customers
     *   GET api/customers/42       // the character with id=42
     *   GET api/customers?name=^j  // 'j' is a regex; returns customers whose name starts with 'j' or
     * 'J' GET api/customers.json/42  // ignores the ".json"
     *
     * Also accepts direct commands to the service in which the last segment of the apiBase is the
     * word "commands" Examples: POST commands/resetDb, GET/POST commands/config - get or (re)set the
     * config
     *
     *   HTTP overrides:
     *     If the injected inMemDbService defines an HTTP method (lowercase)
     *     The request is forwarded to that method as in
     *     `inMemDbService.get(requestInfo)`
     *     which must return either an Observable of the response type
     *     for this http library or null|undefined (which means "keep processing").
     */
    protected handleRequest(req: RequestCore): Observable<any>;
    protected handleRequest_(req: RequestCore): Observable<any>;
    /**
     * Add configured delay to response observable unless delay === 0
     */
    protected addDelay(response: Observable<any>): Observable<any>;
    /**
     * Apply query/search parameters as a filter over the collection
     * This impl only supports RegExp queries on string properties of the collection
     * ANDs the conditions together
     */
    protected applyQuery(collection: any[], query: Map<string, string[]>): any[];
    /**
     * Get a method from the `InMemoryDbService` (if it exists), bound to that service
     */
    protected bind<T extends Function>(methodName: string): T | undefined;
    protected bodify(data: any): any;
    protected clone(data: any): any;
    protected collectionHandler(reqInfo: RequestInfo_2): ResponseOptions;
    /**
     * Commands reconfigure the in-memory web api service or extract information from it.
     * Commands ignore the latency delay and respond ASAP.
     *
     * When the last segment of the `apiBase` path is "commands",
     * the `collectionName` is the command.
     *
     * Example URLs:
     *   commands/resetdb (POST) // Reset the "database" to its original state
     *   commands/config (GET)   // Return this service's config object
     *   commands/config (POST)  // Update the config (e.g. the delay)
     *
     * Usage:
     *   http.post('commands/resetdb', undefined);
     *   http.get('commands/config');
     *   http.post('commands/config', '{"delay":1000}');
     */
    protected commands(reqInfo: RequestInfo_2): Observable<any>;
    protected createErrorResponseOptions(url: string, status: number, message: string): ResponseOptions;
    /**
     * Create standard HTTP headers object from hash map of header strings
     * @param headers
     */
    protected abstract createHeaders(headers: {
        [index: string]: string;
    }): HttpHeaders;
    /**
     * create the function that passes unhandled requests through to the "real" backend.
     */
    protected abstract createPassThruBackend(): PassThruBackend;
    /**
     * return a search map from a location query/search string
     */
    protected abstract createQueryMap(search: string): Map<string, string[]>;
    /**
     * Create a cold response Observable from a factory for ResponseOptions
     * @param resOptionsFactory - creates ResponseOptions when observable is subscribed
     * @param withDelay - if true (default), add simulated latency delay from configuration
     */
    protected createResponse$(resOptionsFactory: () => ResponseOptions, withDelay?: boolean): Observable<any>;
    /**
     * Create a Response observable from ResponseOptions observable.
     */
    protected abstract createResponse$fromResponseOptions$(resOptions$: Observable<ResponseOptions>): Observable<any>;
    /**
     * Create a cold Observable of ResponseOptions.
     * @param resOptionsFactory - creates ResponseOptions when observable is subscribed
     */
    protected createResponseOptions$(resOptionsFactory: () => ResponseOptions): Observable<ResponseOptions>;
    protected delete({ collection, collectionName, headers, id, url }: RequestInfo_2): ResponseOptions;
    /**
     * Find first instance of item in collection by `item.id`
     * @param collection
     * @param id
     */
    protected findById<T extends {
        id: any;
    }>(collection: T[], id: any): T | undefined;
    /**
     * Generate the next available id for item in this collection
     * Use method from `inMemDbService` if it exists and returns a value,
     * else delegates to `genIdDefault`.
     * @param collection - collection of items with `id` key property
     */
    protected genId<T extends {
        id: any;
    }>(collection: T[], collectionName: string): any;
    /**
     * Default generator of the next available id for item in this collection
     * This default implementation works only for numeric ids.
     * @param collection - collection of items with `id` key property
     * @param collectionName - name of the collection
     */
    protected genIdDefault<T extends {
        id: any;
    }>(collection: T[], collectionName: string): any;
    protected get({ collection, collectionName, headers, id, query, url }: RequestInfo_2): ResponseOptions;
    /** Get JSON body from the request object */
    protected abstract getJsonBody(req: any): any;
    /**
     * Get location info from a url, even on server where `document` is not defined
     */
    protected getLocation(url: string): UriInfo;
    /**
     * get or create the function that passes unhandled requests
     * through to the "real" backend.
     */
    protected getPassThruBackend(): PassThruBackend;
    /**
     * Get utility methods from this service instance.
     * Useful within an HTTP method override
     */
    protected getRequestInfoUtils(): RequestInfoUtilities;
    /**
     * return canonical HTTP method name (lowercase) from the request object
     * e.g. (req.method || 'get').toLowerCase();
     * @param req - request object from the http call
     *
     */
    protected abstract getRequestMethod(req: any): string;
    protected indexOf(collection: any[], id: number): number;
    /** Parse the id as a number. Return original value if not a number. */
    protected parseId(collection: any[], collectionName: string, id: string): any;
    /**
     * return true if can determine that the collection's `item.id` is a number
     * This implementation can't tell if the collection is empty so it assumes NO
     * */
    protected isCollectionIdNumeric<T extends {
        id: any;
    }>(collection: T[], collectionName: string): boolean;
    /**
     * Parses the request URL into a `ParsedRequestUrl` object.
     * Parsing depends upon certain values of `config`: `apiBase`, `host`, and `urlRoot`.
     *
     * Configuring the `apiBase` yields the most interesting changes to `parseRequestUrl` behavior:
     *   When apiBase=undefined and url='http://localhost/api/collection/42'
     *     {base: 'api/', collectionName: 'collection', id: '42', ...}
     *   When apiBase='some/api/root/' and url='http://localhost/some/api/root/collection'
     *     {base: 'some/api/root/', collectionName: 'collection', id: undefined, ...}
     *   When apiBase='/' and url='http://localhost/collection'
     *     {base: '/', collectionName: 'collection', id: undefined, ...}
     *
     * The actual api base segment values are ignored. Only the number of segments matters.
     * The following api base strings are considered identical: 'a/b' ~ 'some/api/' ~ `two/segments'
     *
     * To replace this default method, assign your alternative to your
     * InMemDbService['parseRequestUrl']
     */
    protected parseRequestUrl(url: string): ParsedRequestUrl;
    protected post({ collection, collectionName, headers, id, req, resourceUrl, url }: RequestInfo_2): ResponseOptions;
    protected put({ collection, collectionName, headers, id, req, url }: RequestInfo_2): ResponseOptions;
    protected removeById(collection: any[], id: number): boolean;
    /**
     * Tell your in-mem "database" to reset.
     * returns Observable of the database because resetting it could be async
     */
    protected resetDb(reqInfo?: RequestInfo_2): Observable<boolean>;
}

/**
 * get the status text from StatusCode
 */
export declare function getStatusText(code: number): string;

/**
 * For Angular `HttpClient` simulate the behavior of a RESTy web api
 * backed by the simple in-memory data store provided by the injected `InMemoryDbService`.
 * Conforms mostly to behavior described here:
 * https://www.restapitutorial.com/lessons/httpmethods.html
 *
 * ### Usage
 *
 * Create an in-memory data store class that implements `InMemoryDbService`.
 * Call `config` static method with this service class and optional configuration object:
 * ```
 * // other imports
 * import { HttpClientModule } from '@angular/common/http';
 * import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
 *
 * import { InMemHeroService, inMemConfig } from '../api/in-memory-hero.service';
 * @NgModule({
 *  imports: [
 *    HttpModule,
 *    HttpClientInMemoryWebApiModule.forRoot(InMemHeroService, inMemConfig),
 *    ...
 *  ],
 *  ...
 * })
 * export class AppModule { ... }
 * ```
 */
export declare class HttpClientBackendService extends BackendService implements HttpBackend {
    private xhrFactory;
    constructor(inMemDbService: InMemoryDbService, config: InMemoryBackendConfigArgs, xhrFactory: XhrFactory);
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
    protected getJsonBody(req: HttpRequest<any>): any;
    protected getRequestMethod(req: HttpRequest<any>): string;
    protected createHeaders(headers: {
        [index: string]: string;
    }): HttpHeaders;
    protected createQueryMap(search: string): Map<string, string[]>;
    protected createResponse$fromResponseOptions$(resOptions$: Observable<ResponseOptions>): Observable<HttpResponse<any>>;
    protected createPassThruBackend(): HttpXhrBackend;
    static ɵfac: i0.ɵɵFactoryDeclaration<HttpClientBackendService, [null, { optional: true; }, null]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HttpClientBackendService>;
}

export declare function httpClientInMemBackendServiceFactory(dbService: InMemoryDbService, options: InMemoryBackendConfig, xhrFactory: XhrFactory): HttpBackend;

export declare class HttpClientInMemoryWebApiModule {
    /**
     *  Redirect the Angular `HttpClient` XHR calls
     *  to in-memory data store that implements `InMemoryDbService`.
     *  with class that implements InMemoryDbService and creates an in-memory database.
     *
     *  Usually imported in the root application module.
     *  Can import in a lazy feature module too, which will shadow modules loaded earlier
     *
     * @param dbCreator - Class that creates seed data for in-memory database. Must implement
     *     InMemoryDbService.
     * @param [options]
     *
     * @example
     * HttpInMemoryWebApiModule.forRoot(dbCreator);
     * HttpInMemoryWebApiModule.forRoot(dbCreator, {useValue: {delay:600}});
     */
    static forRoot(dbCreator: Type<InMemoryDbService>, options?: InMemoryBackendConfigArgs): ModuleWithProviders<HttpClientInMemoryWebApiModule>;
    /**
     *
     * Enable and configure the in-memory web api in a lazy-loaded feature module.
     * Same as `forRoot`.
     * This is a feel-good method so you can follow the Angular style guide for lazy-loaded modules.
     */
    static forFeature(dbCreator: Type<InMemoryDbService>, options?: InMemoryBackendConfigArgs): ModuleWithProviders<HttpClientInMemoryWebApiModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HttpClientInMemoryWebApiModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<HttpClientInMemoryWebApiModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<HttpClientInMemoryWebApiModule>;
}

/**
 *  InMemoryBackendService configuration options
 *  Usage:
 *    InMemoryWebApiModule.forRoot(InMemHeroService, {delay: 600})
 *
 *  or if providing separately:
 *    provide(InMemoryBackendConfig, {useValue: {delay: 600}}),
 */
export declare class InMemoryBackendConfig implements InMemoryBackendConfigArgs {
    constructor(config?: InMemoryBackendConfigArgs);
    static ɵfac: i0.ɵɵFactoryDeclaration<InMemoryBackendConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InMemoryBackendConfig>;
}

/**
 * Interface for InMemoryBackend configuration options
 */
export declare abstract class InMemoryBackendConfigArgs {
    /**
     * The base path to the api, e.g, 'api/'.
     * If not specified than `parseRequestUrl` assumes it is the first path segment in the request.
     */
    apiBase?: string;
    /**
     * false (default) if search match should be case insensitive
     */
    caseSensitiveSearch?: boolean;
    /**
     * false (default) put content directly inside the response body.
     * true: encapsulate content in a `data` property inside the response body, `{ data: ... }`.
     */
    dataEncapsulation?: boolean;
    /**
     * delay (in ms) to simulate latency
     */
    delay?: number;
    /**
     * false (default) should 204 when object-to-delete not found; true: 404
     */
    delete404?: boolean;
    /**
     * host for this service, e.g., 'localhost'
     */
    host?: string;
    /**
     * false (default) should pass unrecognized request URL through to original backend; true: 404
     */
    passThruUnknownUrl?: boolean;
    /**
     * true (default) should NOT return the item (204) after a POST. false: return the item (200).
     */
    post204?: boolean;
    /**
     * false (default) should NOT update existing item with POST. false: OK to update.
     */
    post409?: boolean;
    /**
     * true (default) should NOT return the item (204) after a POST. false: return the item (200).
     */
    put204?: boolean;
    /**
     * false (default) if item not found, create as new item; false: should 404.
     */
    put404?: boolean;
    /**
     * root path _before_ any API call, e.g., ''
     */
    rootPath?: string;
}

/**
 * Interface for a class that creates an in-memory database
 *
 * Its `createDb` method creates a hash of named collections that represents the database
 *
 * For maximum flexibility, the service may define HTTP method overrides.
 * Such methods must match the spelling of an HTTP method in lower case (e.g, "get").
 * If a request has a matching method, it will be called as in
 * `get(info: requestInfo, db: {})` where `db` is the database object described above.
 */
export declare abstract class InMemoryDbService {
    /**
     * Creates an in-memory "database" hash whose keys are collection names
     * and whose values are arrays of collection objects to return or update.
     *
     * returns Observable of the database because could have to create it asynchronously.
     *
     * This method must be safe to call repeatedly.
     * Each time it should return a new object with new arrays containing new item objects.
     * This condition allows the in-memory backend service to mutate the collections
     * and their items without touching the original source data.
     *
     * The in-mem backend service calls this method without a value the first time.
     * The service calls it with the `RequestInfo` when it receives a POST `commands/resetDb` request.
     * Your InMemoryDbService can adjust its behavior accordingly.
     */
    abstract createDb(reqInfo?: RequestInfo_2): {} | Observable<{}> | Promise<{}>;
}

export declare class InMemoryWebApiModule {
    /**
     *  Redirect BOTH Angular `Http` and `HttpClient` XHR calls
     *  to in-memory data store that implements `InMemoryDbService`.
     *  with class that implements InMemoryDbService and creates an in-memory database.
     *
     *  Usually imported in the root application module.
     *  Can import in a lazy feature module too, which will shadow modules loaded earlier
     *
     * @param dbCreator - Class that creates seed data for in-memory database. Must implement
     *     InMemoryDbService.
     * @param [options]
     *
     * @example
     * InMemoryWebApiModule.forRoot(dbCreator);
     * InMemoryWebApiModule.forRoot(dbCreator, {useValue: {delay:600}});
     */
    static forRoot(dbCreator: Type<InMemoryDbService>, options?: InMemoryBackendConfigArgs): ModuleWithProviders<InMemoryWebApiModule>;
    /**
     *
     * Enable and configure the in-memory web api in a lazy-loaded feature module.
     * Same as `forRoot`.
     * This is a feel-good method so you can follow the Angular style guide for lazy-loaded modules.
     */
    static forFeature(dbCreator: Type<InMemoryDbService>, options?: InMemoryBackendConfigArgs): ModuleWithProviders<InMemoryWebApiModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InMemoryWebApiModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<InMemoryWebApiModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<InMemoryWebApiModule>;
}

/**
 * Returns true if the Http Status Code is 200-299 (success)
 */
export declare function isSuccess(status: number): boolean;

/**
 *
 * Interface for the result of the `parseRequestUrl` method:
 *   Given URL "http://localhost:8080/api/customers/42?foo=1 the default implementation returns
 *     base: 'api/'
 *     collectionName: 'customers'
 *     id: '42'
 *     query: this.createQuery('foo=1')
 *     resourceUrl: 'http://localhost/api/customers/'
 */
export declare interface ParsedRequestUrl {
    apiBase: string;
    collectionName: string;
    id: string;
    query: Map<string, string[]>;
    resourceUrl: string;
}

/** Return information (UriInfo) about a URI  */
export declare function parseUri(str: string): UriInfo;

export declare interface PassThruBackend {
    /**
     * Handle an HTTP request and return an Observable of HTTP response
     * Both the request type and the response type are determined by the supporting HTTP library.
     */
    handle(req: any): Observable<any>;
}

export declare function removeTrailingSlash(path: string): string;

/**
 *  Minimum definition needed by base class
 */
export declare interface RequestCore {
    url: string;
    urlWithParams?: string;
}

/**
 * Interface for object w/ info about the current request url
 * extracted from an Http Request.
 * Also holds utility methods and configuration data from this service
 */
declare interface RequestInfo_2 {
    req: RequestCore;
    apiBase: string;
    collectionName: string;
    collection: any;
    headers: HttpHeaders;
    method: string;
    id: any;
    query: Map<string, string[]>;
    resourceUrl: string;
    url: string;
    utils: RequestInfoUtilities;
}
export { RequestInfo_2 as RequestInfo }

/**
 * Interface for utility methods from this service instance.
 * Useful within an HTTP method override
 */
export declare interface RequestInfoUtilities {
    /**
     * Create a cold response Observable from a factory for ResponseOptions
     * the same way that the in-mem backend service does.
     * @param resOptionsFactory - creates ResponseOptions when observable is subscribed
     * @param withDelay - if true (default), add simulated latency delay from configuration
     */
    createResponse$: (resOptionsFactory: () => ResponseOptions) => Observable<any>;
    /**
     * Find first instance of item in collection by `item.id`
     * @param collection
     * @param id
     */
    findById<T extends {
        id: any;
    }>(collection: T[], id: any): T | undefined;
    /** return the current, active configuration which is a blend of defaults and overrides */
    getConfig(): InMemoryBackendConfigArgs;
    /** Get the in-mem service's copy of the "database" */
    getDb(): {};
    /** Get JSON body from the request object */
    getJsonBody(req: any): any;
    /** Get location info from a url, even on server where `document` is not defined */
    getLocation(url: string): UriInfo;
    /** Get (or create) the "real" backend */
    getPassThruBackend(): PassThruBackend;
    /**
     * return true if can determine that the collection's `item.id` is a number
     * */
    isCollectionIdNumeric<T extends {
        id: any;
    }>(collection: T[], collectionName: string): boolean;
    /**
     * Parses the request URL into a `ParsedRequestUrl` object.
     * Parsing depends upon certain values of `config`: `apiBase`, `host`, and `urlRoot`.
     */
    parseRequestUrl(url: string): ParsedRequestUrl;
}

/**
 * Provide a `responseInterceptor` method of this type in your `inMemDbService` to
 * morph the response options created in the `collectionHandler`.
 */
export declare type ResponseInterceptor = (res: ResponseOptions, ri: RequestInfo_2) => ResponseOptions;

export declare interface ResponseOptions {
    /**
     * String, Object, ArrayBuffer or Blob representing the body of the {@link Response}.
     */
    body?: string | Object | ArrayBuffer | Blob;
    /**
     * Response headers
     */
    headers?: HttpHeaders;
    /**
     * Http {@link https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html status code}
     * associated with the response.
     */
    status?: number;
    /**
     * Status text for the status code
     */
    statusText?: string;
    /**
     * request url
     */
    url?: string;
}


export declare const STATUS: {
    CONTINUE: number;
    SWITCHING_PROTOCOLS: number;
    OK: number;
    CREATED: number;
    ACCEPTED: number;
    NON_AUTHORITATIVE_INFORMATION: number;
    NO_CONTENT: number;
    RESET_CONTENT: number;
    PARTIAL_CONTENT: number;
    MULTIPLE_CHOICES: number;
    MOVED_PERMANTENTLY: number;
    FOUND: number;
    SEE_OTHER: number;
    NOT_MODIFIED: number;
    USE_PROXY: number;
    TEMPORARY_REDIRECT: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    PAYMENT_REQUIRED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    METHOD_NOT_ALLOWED: number;
    NOT_ACCEPTABLE: number;
    PROXY_AUTHENTICATION_REQUIRED: number;
    REQUEST_TIMEOUT: number;
    CONFLICT: number;
    GONE: number;
    LENGTH_REQUIRED: number;
    PRECONDITION_FAILED: number;
    PAYLOAD_TO_LARGE: number;
    URI_TOO_LONG: number;
    UNSUPPORTED_MEDIA_TYPE: number;
    RANGE_NOT_SATISFIABLE: number;
    EXPECTATION_FAILED: number;
    IM_A_TEAPOT: number;
    UPGRADE_REQUIRED: number;
    INTERNAL_SERVER_ERROR: number;
    NOT_IMPLEMENTED: number;
    BAD_GATEWAY: number;
    SERVICE_UNAVAILABLE: number;
    GATEWAY_TIMEOUT: number;
    HTTP_VERSION_NOT_SUPPORTED: number;
    PROCESSING: number;
    MULTI_STATUS: number;
    IM_USED: number;
    PERMANENT_REDIRECT: number;
    UNPROCESSABLE_ENTRY: number;
    LOCKED: number;
    FAILED_DEPENDENCY: number;
    PRECONDITION_REQUIRED: number;
    TOO_MANY_REQUESTS: number;
    REQUEST_HEADER_FIELDS_TOO_LARGE: number;
    UNAVAILABLE_FOR_LEGAL_REASONS: number;
    VARIANT_ALSO_NEGOTIATES: number;
    INSUFFICIENT_STORAGE: number;
    NETWORK_AUTHENTICATION_REQUIRED: number;
};

export declare const STATUS_CODE_INFO: {
    [key: string]: {
        code: number;
        text: string;
        description: string;
        spec_title: string;
        spec_href: string;
    };
};

/** Interface of information about a Uri  */
export declare interface UriInfo {
    source: string;
    protocol: string;
    authority: string;
    userInfo: string;
    user: string;
    password: string;
    host: string;
    port: string;
    relative: string;
    path: string;
    directory: string;
    file: string;
    query: string;
    anchor: string;
}

export { }
