import { InjectionToken } from "@angular/core";

export interface FirebaseAppConfig {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    projectId?: string;
  }
  
export const FirebaseAppConfigToken = new InjectionToken<FirebaseAppConfig>('FirebaseAppConfigToken');