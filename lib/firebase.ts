import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-7sDJml7-a_E3nKGdmX8pAtPSZyuPk_4",
  authDomain: "kilolook.firebaseapp.com",
  projectId: "kilolook",
  storageBucket: "kilolook.firebasestorage.app",
  messagingSenderId: "885863365154",
  appId: "1:885863365154:web:94322b1d3b62735bb3a87b",
  measurementId: "G-MSTFXXY4CZ"
};

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Cache analytics instance
let analytics: Analytics | null = null;

// Analytics can only be initialized in the browser
export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  // Return cached instance if available
  if (analytics) {
    return analytics;
  }

  try {
    // Check if Analytics is supported
    const supported = await isSupported();
    if (!supported) {
      console.warn("Firebase Analytics is not supported in this environment");
      return null;
    }

    // Initialize Analytics (only once)
    analytics = getAnalytics(app);
    return analytics;
  } catch (error) {
    console.error("Firebase Analytics initialization error:", error);
    return null;
  }
};

export { app };
export default app;

