// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    projectId: 'nfl-parlay-club',
    appId: '1:340422475086:web:a7764014fc0a82eb33321f',
    databaseURL: 'https://nfl-parlay-club.firebaseio.com',
    storageBucket: 'nfl-parlay-club.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyALVus8xG9O_z-DO5Ac7Z4DROsP25d7z-U',
    authDomain: 'nfl-parlay-club.firebaseapp.com',
    messagingSenderId: '340422475086',
    measurementId: 'G-C1VQC0WRKB',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
