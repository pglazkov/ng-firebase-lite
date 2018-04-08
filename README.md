# ng-firebase-lite
Very very lightweight library that helps with using [Firebase SDK](https://www.npmjs.com/package/firebase) in an Angular project.

## How is it different from [angularfire2](https://github.com/angular/angularfire2) or [angularfire-lite](https://github.com/hamedbaatour/angularfire-lite)?
Those libraries are much bigger and wrap all or most API's from [Firebase SDK](https://www.npmjs.com/package/firebase). This library, on the other hand, doesn't attempt to wrap all the API's, but just provides
a convinient way to access Firebase SDK in a form of a simple `FirebaseApp` service that you can inject anywhere in your app. 

Here are some of the reasons why you might consider using this library:
- Bundle size. As mentioned above, this library doesn't add much on top of [Firebase SDK](https://www.npmjs.com/package/firebase), so the footprint is tiny. 
- Program closer to the [official API](https://firebase.google.com/docs/web/setup) of [Firebase SDK](https://www.npmjs.com/package/firebase). This is convinient because all the examples in the official docs for Firebase (at https://firebase.google.com/docs) as well as StackOverflow answers will be directly applicable (as opposed to having to find the analogous API's in the docs of the wrapper libraries).
- Consistency between client-side and server-side code. For example, to access Firebase from Cloud Functions you would need to use [Firebase Admin Node.js SDK](https://firebase.google.com/docs/admin/setup/), which has the same or similar API as [Firebase SDK](https://www.npmjs.com/package/firebase).
- Less code = less complexity = less bugs. Consider the [issue list](https://github.com/angular/angularfire2/issues) for [angularfire2](https://github.com/angular/angularfire2). Also consider that [angularfire2](https://github.com/angular/angularfire2) hasn't had a stable release yet and is in RC stage for almost a year now (**!**).

## Installation & Setup
The installation and setup instructions are very similar to [angularfire2](https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md):

### 1. Install `ng-firebase-lite` and `firebase`
```bash
npm install ng-firebase-lite firebase --save
```

### 2. Add Firebase config to environments variable
Open `/src/environments/environment.ts` and add your Firebase configuration. You can find your project configuration in [the Firebase Console](https://console.firebase.google.com). From the project overview page, click **Add Firebase to your web app**.

```ts
import { FirebaseAppConfig } from 'ng-firebase-lite';

export const environment = {
  production: false,
  firebase: {
    apiKey: '<your-key>',
    authDomain: '<your-project-authdomain>',
    databaseURL: '<your-database-URL>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>'
  } as FirebaseAppConfig
};
```

### 3. Setup `@NgModule` for the `FirebaseAppModule`
Open `/src/app/app.module.ts`, inject the Firebase providers, and specify your Firebase configuration.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FirebaseAppModule } from 'ng-firebase-lite';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    FirebaseAppModule.initializeApp(environment.firebase)
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```

## Usage
After you've imported `FirebaseAppModule` in your `AppModule` as described above, you can now inject `FirebaseApp` service anywhere you want to use the [Firebase API](https://firebase.google.com/docs/reference/js/). 

### Examples:
**Auth**
```ts
...
import { FirebaseApp } from 'ng-firebase-lite';
import { auth } from 'firebase/app';
...

@Injectable()
export class AuthService {
  private readonly auth: auth.Auth;

  constructor(private fba: FirebaseApp) {
    this.auth = fba.auth();

    this.auth.onAuthStateChanged(() => {
      console.log(`onAuthStateChanged. User: ${this.auth.currentUser}`);
    });
  }

  login(provider: auth.AuthProvider): void {
    this.auth.signInWithRedirect(provider).then(() => {
      console.log('Login successful');
    }, err => console.error(err));
  }
}
```
**Firestore**
```ts
@Injectable()
export class StorageService {

  private readonly db: firestore.Firestore;

  constructor(private fba: FirebaseApp) {
    this.db = fba.firestore();
  }

  getItems(): Observable<Item[]> {
    const resultStream = new Subject<Item[]>();

    let query = this.db
      .collection('users')
      .doc(this.userId)
      .collection('my-collection');

    let unsubscribeOnSnapshot: () => void = () => {};

    unsubscribeOnSnapshot = query.onSnapshot(snapshot => {
      resultStream.next(snapshot.docs);
    }, error => {
      resultStream.error(error)
    }, () => {
      resultStream.complete();
    });

    return Observable.create((observer: Subscriber<Item[]>) => {
      resultStream.subscribe(observer);

      return () => {
        unsubscribeOnSnapshot();
      };
    });
  }
```