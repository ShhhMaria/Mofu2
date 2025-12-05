import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const env = import.meta.env as any;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyBodlN2GGyE5lLjn760CtAYVtjCmNsGJ_s",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "mofu2-c7126.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "mofu2-c7126",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "mofu2-c7126.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "909566339858",
  appId: env.VITE_FIREBASE_APP_ID || "1:909566339858:web:767f93a4a75c3037ace1cb"
};

// Non-secret debug: show if important env vars are present (DO NOT log API keys)
const hasApiKey = Boolean(env.VITE_FIREBASE_API_KEY);
console.info('Firebase debug:', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  hasApiKey
});
if (!hasApiKey) {
  console.warn('VITE_FIREBASE_API_KEY not set. Using demo fallback key — authentication will fail. Add your Firebase config to `.env.local`.');
}

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export const isFirebaseConfigured = hasApiKey;
export { app, auth, db };