import * as firebase from 'firebase';
import { InjectionToken, NgModule, NgZone } from '@angular/core';
import { FirebaseAppConfig, FirebaseAppConfigToken } from './firebase-app-config';
import { FirebaseApp } from './firebase-app';

export function _firebaseAppFactory(config: FirebaseAppConfig, zone: NgZone): FirebaseApp {
  return zone.runOutsideAngular(()=> firebase.initializeApp(config) as FirebaseApp);
}

// Have to mark it as "dynamic" because of the AOT compilation error: "Arrow lambda not supported in static function" (in relation to `zone.runOutsideAngular` call above).
// See https://github.com/dherges/ng-packagr/issues/696 for details.
// @dynamic
@NgModule({
  providers: []
})
export class FirebaseAppModule {
  static initializeApp(config: FirebaseAppConfig) {
    return {
      ngModule: FirebaseAppModule,
      providers: [
        { 
          provide: FirebaseAppConfigToken, 
          useValue: config 
        },
        {
          provide: FirebaseApp,
          useFactory: _firebaseAppFactory,
          deps: [ FirebaseAppConfigToken, NgZone ]
        }
      ]
    };
  }
}
