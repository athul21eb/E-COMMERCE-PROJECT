// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fireboots-585cf.firebaseapp.com",
  projectId: "fireboots-585cf",
  storageBucket: "fireboots-585cf.firebasestorage.app",
  messagingSenderId: "378788725766",
  appId: "1:378788725766:web:d86938ce518325d8fd6f87"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp