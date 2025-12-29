"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

export default function FirebaseAnalytics() {
  useEffect(() => {
    // Initialize Firebase Analytics only on client side
    const initAnalytics = async () => {
      const analytics = await getFirebaseAnalytics();
      
      if (analytics) {
        console.log("Firebase Analytics initialized successfully");
      }
    };

    initAnalytics();
  }, []);

  return null; // This component doesn't render anything
}

