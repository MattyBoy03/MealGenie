// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  // Add this import
import { FirebaseOptions } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCGfmH-yuIkJbq-q08PJcG_Fct3B63dJGo',
  authDomain: 'mealgenie-92aaa.firebaseapp.com',
  projectId: 'mealgenie-92aaa',
  storageBucket: 'mealgenie-92aaa.appspot.com',
  messagingSenderId: '1075223853445',
  appId: '1:1075223853445:web:93fa750454f10b6a466cec',
  measurementId: 'G-7GSYEVGY87',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);  // Initialize Firestore here

export { auth, firestore };  // Make sure to export firestore here
export { app };