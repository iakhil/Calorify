// services/firebaseAuth.js
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firebase Authentication
const auth = getAuth(app);

// Function to handle user login with email and password
export const login = async (email, password) => {
  try {
    // Attempt to sign in with the given credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    // Handle errors (e.g., invalid email, wrong password)
    throw new Error(error.message);
  }
};

// Function to handle user sign up (if you need sign-up functionality as well)
export const signUp = async (email, password) => {
  try {
    // Create a new user with the given email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to handle user logout
export const logout = async () => {
  try {
    // Sign out the current user
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to get the current authenticated user
export const getCurrentUser = () => {
  return auth.currentUser;
};
