// Centralized Firebase initialization for the site
// Usage: import { app, db, analytics } from './firebase-config.js'

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase configuration for illumina project
export const firebaseConfig = {
  apiKey: "AIzaSyAassi2F4y4adunXsldCtUhyBEYbZ-_zhs",
  authDomain: "illumina-8b77e.firebaseapp.com",
  projectId: "illumina-8b77e",
  storageBucket: "illumina-8b77e.firebasestorage.app",
  messagingSenderId: "338639323541",
  appId: "1:338639323541:web:e32ea18e1f70033d15b69c",
  measurementId: "G-RWPYF043LH"
};

export const app = initializeApp(firebaseConfig);
export const analytics = (() => { try { return getAnalytics(app); } catch (_) { return null; } })();

// Use long-polling auto-detection to avoid 400 RPC issues behind proxies/ad blockers
export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
