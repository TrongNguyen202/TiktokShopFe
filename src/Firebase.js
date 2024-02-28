import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmrEEz3cGNtY0KbHXPJu-EBrwEWHZ3070",
  authDomain: "tiktokshop-44408.firebaseapp.com",
  projectId: "tiktokshop-44408",
  storageBucket: "tiktokshop-44408.appspot.com",
  messagingSenderId: "147056414262",
  appId: "1:147056414262:web:3eb8767d68e9d2fa305297",
  measurementId: "G-ZWHS7XLVXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const providerGoogle = new GoogleAuthProvider();
providerGoogle.addScope('https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file');
export const signInWithGoogle = () => {
  return signInWithPopup(auth, providerGoogle);
};