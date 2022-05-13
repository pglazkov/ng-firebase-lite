import { InjectionToken } from "@angular/core"
import { FirebaseApp } from "firebase/app"

export const firebaseAppToken = new InjectionToken<FirebaseApp>('FIREBASE_APP');