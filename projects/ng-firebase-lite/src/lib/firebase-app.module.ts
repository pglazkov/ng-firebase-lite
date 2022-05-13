import { ModuleWithProviders, NgModule, NgZone } from '@angular/core';
import { firebaseAppConfigToken } from './firebase-app-config';
import { FirebaseApp, initializeApp, FirebaseOptions } from 'firebase/app';
import { firebaseAppToken } from './firebase-app-token';

export function _firebaseAppFactory(config: FirebaseOptions, zone: NgZone): FirebaseApp {
  return zone.runOutsideAngular(() => initializeApp(config) as FirebaseApp);
}

// Have to mark it as "dynamic" because of the AOT compilation error: "Arrow lambda not supported in static function" (in relation to `zone.runOutsideAngular` call above).
// See https://github.com/dherges/ng-packagr/issues/696 for details.
// @dynamic
@NgModule({
  providers: []
})
export class FirebaseAppModule {
  static initializeApp(config: FirebaseOptions): ModuleWithProviders<FirebaseAppModule> {
    return {
      ngModule: FirebaseAppModule,
      providers: [
        {
          provide: firebaseAppConfigToken,
          useValue: config
        },
        {
          provide: firebaseAppToken,
          useFactory: _firebaseAppFactory,
          deps: [firebaseAppConfigToken, NgZone]
        }
      ]
    };
  }
}
