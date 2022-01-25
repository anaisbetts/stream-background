import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

import { firebaseConfig } from './firebase-config'

try {
  initializeApp(firebaseConfig)
  // tslint:disable-next-line:no-empty
} catch (_e) {}

export const db = getFirestore()
