import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCa-ldD6AOKcmiovT3VCNBwPdCZ41jMGR4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dumdum-delivery.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dumdum-delivery",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dumdum-delivery.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "820745608248",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:820745608248:web:1c61445e9e4a691feedacd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LBMK993W30"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
googleProvider.addScope("https://www.googleapis.com/auth/user.phonenumbers.read");

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "dumdumdelivery";
export const db = getFirestore(app, databaseId);
export const storage = getStorage(app);

export const analyticsPromise = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null
);
