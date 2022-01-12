import * as firebase from "firebase/app";
import "firebase/firestore";

import { firebaseConfig } from "secrets/firebase-config";

try {
  firebase.initializeApp(firebaseConfig);
  // tslint:disable-next-line:no-empty
} catch (_e) {}

export const db = firebase.firestore!();
db.settings({});
