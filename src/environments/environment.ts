// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const ports = {
  admin: 4200,
  customer: 4201,
  api: 3000,
};
const serverIPDomain = 'localhost';
const apiPathWithPort = 'http://' + serverIPDomain + ':' + ports.api + '/';
export const environment = {
  production: false,
  appVersion: 'v1.0.0',
  USERDATA_KEY: 'auths3cr3tAll!@nc3UD@atm',
  isMockEnabled: false,
  apiUrl: apiPathWithPort + 'v1/',
  apiServerPath: apiPathWithPort + 'uploads/',
  maxLimit: 1000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
