import * as firebase from 'firebase/app';

export abstract class FirebaseApp implements firebase.app.App {
    abstract name: string;
    abstract options: {};
    abstract auth: () => firebase.auth.Auth;
    abstract database: () => firebase.database.Database;
    abstract messaging: () => firebase.messaging.Messaging;
    abstract storage: () => firebase.storage.Storage;
    abstract delete: () => Promise<any>;
    abstract firestore: () => firebase.firestore.Firestore;
  }