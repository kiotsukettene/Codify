import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCW66RpAluOdi6VBt5ziAS8PeuYsDCiSNI",
    authDomain: "codify-lms-65d6c.firebaseapp.com",
    projectId: "codify-lms-65d6c",
    storageBucket: "codify-lms-65d6c.firebasestorage.app",
    messagingSenderId: "257130606117",
    appId: "1:257130606117:web:38cc3c129200cbdc5ad9cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
