import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDwaX0yt7_n6YMZY9K0CxZo7BVocreGWL0",
    authDomain: "citycrown-a7433.firebaseapp.com",
    projectId: "citycrown-a7433",
    storageBucket: "citycrown-a7433.appspot.com",
    messagingSenderId: "1051785739941",
    appId: "1:1051785739941:web:6bd9321faae3e06bd1174c",
    measurementId: "G-Q2YDYM7C5E"
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage();
const auth = getAuth();
export const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};
export const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};