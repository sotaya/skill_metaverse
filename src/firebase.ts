import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDE_S1cSnBIYgE0ktxiUtV0RmzOXunYB68",
  authDomain: "skill-metaverse-3f991.firebaseapp.com",
  projectId: "skill-metaverse-3f991",
  storageBucket: "skill-metaverse-3f991.firebasestorage.app",
  messagingSenderId: "307465756414",
  appId: "1:307465756414:web:32c11bf970548a7f974faf",
  measurementId: "G-1FB77SFXT9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db };
