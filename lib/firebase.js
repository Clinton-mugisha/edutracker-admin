import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBEUUksQ3C3VguFvAzeexik0yql8AzXdbc",
  authDomain: "education-bce1e.firebaseapp.com",
  projectId: "education-bce1e",
  storageBucket: "education-bce1e.firebasestorage.app",
  messagingSenderId: "269754117585",
  appId: "1:269754117585:web:c761ad25066957af4a84f0",
  measurementId: "G-Z40RKSQ9TJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
