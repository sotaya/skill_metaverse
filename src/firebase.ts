import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAThNCMH_twXwwYjCoP8gOtTz5mz3jEBzs",
  authDomain: "skill-metaverse.firebaseapp.com",
  projectId: "skill-metaverse",
  storageBucket: "skill-metaverse.firebasestorage.app",
  messagingSenderId: "481253260540",
  appId: "1:481253260540:web:66bf2737ee35b37fd56b79",
  measurementId: "G-7JZQ089E1G",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db };
