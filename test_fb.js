
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "gcare-50d75.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testUpload() {
  try {
    const buffer = Buffer.from("test content");
    const storageRef = ref(storage, "test_file.txt");
    console.log("Uploading to:", process.env.VITE_FIREBASE_STORAGE_BUCKET);
    await uploadBytes(storageRef, buffer);
    const url = await getDownloadURL(storageRef);
    console.log("Success! URL:", url);
  } catch (err) {
    console.error("Full Error Object:", err);
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
  }
}

testUpload();
