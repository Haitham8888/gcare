
const ImageKit = require("imagekit");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const imagekit = new ImageKit({
    publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.VITE_IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT
});

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function uploadFile(localPath, fileName, folder) {
    if (!fs.existsSync(localPath)) return null;
    try {
        const fileContent = fs.readFileSync(localPath);
        const result = await imagekit.upload({
            file: fileContent,
            fileName: fileName,
            folder: folder
        });
        console.log(`✅ Uploaded: ${fileName} -> ${result.url}`);
        return result.url;
    } catch (err) {
        console.error(`❌ Upload Error (${fileName}):`, err.message);
        return null;
    }
}

async function run() {
    console.log("🚀 Starting Global Migration to ImageKit (20GB)...");

    // 1. Doctors
    const experts = JSON.parse(fs.readFileSync("src/data/experts.json", "utf-8")).experts;
    for (const exp of experts) {
        const fbUrl = await uploadFile(path.join("public", exp.img), path.basename(exp.img), "/experts");
        await supabase.from("doctors").insert({
            name_ar: exp.name_ar, name_en: exp.name_en, role_ar: exp.role_ar, role_en: exp.role_en, img: fbUrl || exp.img
        });
    }

    // 2. Products
    const products = JSON.parse(fs.readFileSync("src/data/products.json", "utf-8")).products;
    for (const prod of products) {
        const fbUrl = await uploadFile(path.join("public", prod.mainImage), path.basename(prod.mainImage), "/products");
        await supabase.from("products").upsert({
            id: prod.id, name_ar: prod.name.ar, name_en: prod.name.en, category: prod.category,
            main_image: fbUrl || prod.mainImage, images: JSON.stringify([fbUrl || prod.mainImage]),
            overview_ar: prod.overview.ar, overview_en: prod.overview.en
        });
    }

    console.log("🏁 Migration Complete!");
}

run();
