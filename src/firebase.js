// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// NOT USED ATM: import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVlLU8CWH0f-xbP6NIwzzTkV_fPeKif-I",
  authDomain: "db-orderly.firebaseapp.com",
  projectId: "db-orderly",
  storageBucket: "db-orderly.firebasestorage.app",
  messagingSenderId: "189977471534",
  appId: "1:189977471534:web:7a6456040fe2dee9c1cdbf",
  measurementId: "G-H28EWKMV0V"
};
initializeApp(firebaseConfig);
// Initialize Firebase
 
 export const db = getFirestore();
 export const storage = getStorage();
 export const auth = getAuth();
// NOT USED ATM: const analytics = getAnalytics(app);