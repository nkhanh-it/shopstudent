
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const meta = import.meta as any;
const firebaseConfig = {
  apiKey: meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyBGf7U5d-Qu1WenzNGc13lgX7QedqRsLEE",
  authDomain: meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "shopstudent-d7f55.firebaseapp.com",
  projectId: meta.env?.VITE_FIREBASE_PROJECT_ID || "shopstudent-d7f55",
  storageBucket: meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "shopstudent-d7f55.firebasestorage.app",
  messagingSenderId: meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "223523775623",
  appId: meta.env?.VITE_FIREBASE_APP_ID || "1:223523775623:web:b2288f6508aa9fa6794422",
  measurementId: meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-W7836TDDBR"
};

let app;
let dbInstance = null;
let storageInstance = null;
let authInstance = null;

try {
    app = initializeApp(firebaseConfig);
    dbInstance = getFirestore(app);
    storageInstance = getStorage(app);
    authInstance = getAuth(app);
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

export const db = dbInstance;
export const storage = storageInstance;
export const auth = authInstance; 
export const analytics = null;
