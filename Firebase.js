// Import the functions you need from the SDKs you need
// app
import { initializeApp } from "firebase/app";
// auth
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
// firestore
import { getFirestore } from "firebase/firestore";
// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9cuu9sRbgII3S0cAUfvYEfIVU_Llk6tI",
    authDomain: "cosmetics-qfd.firebaseapp.com",
    projectId: "cosmetics-qfd",
    storageBucket: "cosmetics-qfd.appspot.com",
    messagingSenderId: "1083053128788",
    appId: "1:1083053128788:web:19529dc893f7ac769981c1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const initAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const auth = getAuth(app);
export const database = getFirestore(app);
