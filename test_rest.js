
import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_FIREBASE_API_KEY;
const BUCKET = "gcare-50d75.appspot.com";

async function testUploadRest() {
  const localFile = "public/static/img/Products/DSC04613.png";
  if (!fs.existsSync(localFile)) {
    console.error("Local file not found");
    return;
  }
  
  const fileName = "test_rest.png";
  const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o?name=${fileName}`;
  
  console.log(`Uploading to: ${url}`);
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "image/png"
    },
    body: fs.readFileSync(localFile)
  });
  
  const data = await response.json();
  console.log("Status:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));
}

testUploadRest();
