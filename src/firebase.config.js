import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp ({
    apiKey: "AIzaSyAHt5Ec_PPqSPk-c0ny8rGcjC1qrDUBc9U",
    authDomain: "fir-8b78c.firebaseapp.com",
    projectId: "fir-8b78c",
    storageBucket: "fir-8b78c.appspot.com",
    messagingSenderId: "954108062183",
    appId: "1:954108062183:web:d4c9a13bfd8c4c13d5f542",
    measurementId: "G-FDHYJMQ33W"
});

// Firebase storage reference
const storage = getStorage(app);
export default storage;