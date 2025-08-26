// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getEnv } from "./getEnv";
import { get } from "react-hook-form";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API'),
  authDomain: "hostel-leave-management-e50b2.firebaseapp.com",
  projectId: "hostel-leave-management-e50b2",
  storageBucket: "hostel-leave-management-e50b2.firebasestorage.app",
  messagingSenderId: "34168311347",
  appId: "1:34168311347:web:95e5c59bda52c394a91d46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider()

export { auth, provider };