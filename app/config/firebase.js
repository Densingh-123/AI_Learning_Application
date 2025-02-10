import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

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
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
const analytics = getAnalytics(app);