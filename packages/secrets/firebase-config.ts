export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
};

export const firebaseBotUser = process.env.FIREBASE_BOT_USER!;
export const firebaseBotPassword = process.env.FIREBASE_BOT_PASSWORD!;
export const defaultTwitchUsername = process.env.TWITCH_USERNAME!;
export const defaultTwitchChannel = defaultTwitchUsername;
