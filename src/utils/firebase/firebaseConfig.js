// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fire-e-commerce-14239.firebaseapp.com",
  projectId: "fire-e-commerce-14239",
  storageBucket: "fire-e-commerce-14239.appspot.com",
  messagingSenderId: "262935703737",
  appId: "1:262935703737:web:e3a652ba40129817c3eb68"
};

// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp