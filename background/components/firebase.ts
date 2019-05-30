import '@firebase/firestore';

import firebase from '@firebase/app';
import { firebaseConfig } from '../../bot/src/firebase-config';

try {
  firebase.initializeApp(firebaseConfig);
  // tslint:disable-next-line:no-empty
} catch (_e) { }

export const db = firebase.firestore!();
db.settings({ timestampsInSnapshots: true });
