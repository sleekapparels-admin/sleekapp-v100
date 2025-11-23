import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX1I8TwagP19t0BeesWJI67vL2DUp_BXs",
  authDomain: "sleek-ai-project.firebaseapp.com",
  projectId: "sleek-ai-project",
  storageBucket: "sleek-ai-project.firebasestorage.app",
  messagingSenderId: "360516211712",
  appId: "1:360516211712:web:ce83b7912d205ba3d5b4e5",
  measurementId: "G-PTM54H4LMB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export firebaseConfig for reference
export { firebaseConfig };
