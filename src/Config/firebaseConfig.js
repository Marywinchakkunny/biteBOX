import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import { getStorage } from 'firebase/storage'; // Import Storage

const firebaseConfig = {
  apiKey: "AIzaSyBhL5WTTUbwh4ZSJd1I8HXnPYld6jqXNmA",
  authDomain: "bitebox-a9ab5.firebaseapp.com",
  projectId: "bitebox-a9ab5",
  storageBucket: "bitebox-a9ab5.appspot.com",
  messagingSenderId: "926234810633",
  appId: "1:926234810633:web:245ee460e1985dca6b5bd8",
  measurementId: "G-SFMQVTBQFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

export { auth, db, storage }; // Export Auth, Firestore, and Storage
