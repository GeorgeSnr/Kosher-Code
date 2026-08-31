// Firebase Configuration
// Environment variables are prioritized for security and GitHub portability
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDSa5qPtlld9Tg_uuv3uX21kXI3MILf_TQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "kosher-code-consulting.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "kosher-code-consulting",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "kosher-code-consulting.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1043094969114",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1043094969114:web:01942e70925eee6fe62aa3",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-9TX80J3JB7"
};

export default firebaseConfig;
