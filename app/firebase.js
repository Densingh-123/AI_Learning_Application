import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhmqJ0f_vDupME6bX4I-bb1kTqZ-PA50U",
  authDomain: "learning-f1664.firebaseapp.com",
  projectId: "learning-f1664",
  storageBucket: "learning-f1664.appspot.com",
  messagingSenderId: "552651403128",
  appId: "1:552651403128:web:d47b343df2719fd52ca28d",
  measurementId: "G-R5QHY3H67Z",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, doc, setDoc, getDoc };