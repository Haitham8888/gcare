
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const fbApp = initializeApp(firebaseConfig);
const storage = getStorage(fbApp);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function uploadFile(localPath, remotePath) {
  if (!fs.existsSync(localPath)) {
    console.log(`⚠️ Skip: File not found ${localPath}`);
    return null;
  }
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const storageRef = ref(storage, remotePath);
    await uploadBytes(storageRef, fileBuffer);
    const url = await getDownloadURL(storageRef);
    console.log(`✅ Uploaded ${localPath} -> ${url}`);
    return url;
  } catch (err) {
    console.error(`❌ Error uploading ${localPath}:`, err.message);
    return null;
  }
}

async function startMigration() {
  console.log("🚀 Starting Global Migration to Firebase + Supabase...");

  // 1. Doctors Migration
  const expertsPath = "src/data/experts.json";
  if (fs.existsSync(expertsPath)) {
    const { experts } = JSON.parse(fs.readFileSync(expertsPath, "utf-8"));
    for (const exp of experts) {
      const localImg = path.join("public", exp.img);
      const remoteImg = `experts/${path.basename(exp.img)}`;
      const fbUrl = await uploadFile(localImg, remoteImg);
      
      const { error } = await supabase.from("doctors").insert({
        name_ar: exp.name_ar,
        name_en: exp.name_en,
        role_ar: exp.role_ar,
        role_en: exp.role_en,
        img: fbUrl || exp.img
      });
      if (error) console.error("DB Error Doctors:", error.message);
    }
  }

  // 2. Products Migration
  const productsPath = "src/data/products.json";
  if (fs.existsSync(productsPath)) {
    const { products } = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
    for (const prod of products) {
      const localImg = path.join("public", prod.mainImage);
      const remoteImg = `products/${path.basename(prod.mainImage)}`;
      const fbUrl = await uploadFile(localImg, remoteImg);
      
      const { error } = await supabase.from("products").upsert({
        id: prod.id,
        name_ar: prod.name.ar,
        name_en: prod.name.en,
        category: prod.category,
        main_image: fbUrl || prod.mainImage,
        images: JSON.stringify([fbUrl || prod.mainImage]),
        overview_ar: prod.overview.ar,
        overview_en: prod.overview.en
      });
      if (error) console.error("DB Error Products:", error.message);
    }
  }

  // 3. Education Migration
  const eduPath = "src/data/education.json";
  if (fs.existsSync(eduPath)) {
    const { articles, posters } = JSON.parse(fs.readFileSync(eduPath, "utf-8"));
    
    for (const art of articles) {
      const localImg = path.join("public", art.img);
      const remoteImg = `education/articles/${path.basename(art.img)}`;
      const fbUrl = await uploadFile(localImg, remoteImg);
      await supabase.from("articles").insert({
        title_key: art.title_key,
        category_key: art.category_key,
        excerpt_key: art.excerpt_key,
        img: fbUrl || art.img
      });
    }

    for (const post of posters) {
      const localImg = path.join("public", post.img);
      const remoteImg = `education/posters/${path.basename(post.img)}`;
      const fbUrl = await uploadFile(localImg, remoteImg);
      await supabase.from("posters").insert({
        title_key: post.title_key,
        img: fbUrl || post.img
      });
    }
  }

  console.log("🏁 Migration Complete!");
}

startMigration();
