
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
    if (!fs.existsSync(localPath)) {
        // Try fallback path if it starts with static/
        const fallback = path.join("public", localPath);
        if (fs.existsSync(fallback)) localPath = fallback;
        else return null;
    }
    try {
        const fileContent = fs.readFileSync(localPath);
        const result = await imagekit.upload({
            file: fileContent,
            fileName: fileName,
            folder: folder,
            useUniqueFileName: false // Keep names predictable
        });
        console.log(`✅ Uploaded: ${fileName} -> ${result.url}`);
        return result.url;
    } catch (err) {
        console.error(`❌ Upload Error (${fileName}):`, err.message);
        return null;
    }
}

async function run() {
    console.log("🚀 Starting Final Migration...");

    // Clear existing data to avoid duplicates in the new DB
    console.log("Clearing existing data...");
    await supabase.from("products").delete().neq("id", "none");
    await supabase.from("doctors").delete().neq("id", 0);
    await supabase.from("articles").delete().neq("id", 0);
    await supabase.from("posters").delete().neq("id", 0);

    // 1. Migrate Experts
    const expertsContent = fs.readFileSync("src/data/experts.json", "utf-8");
    const { experts } = JSON.parse(expertsContent);
    for (const exp of experts) {
        console.log(`Processing Export: ${exp.name_en}`);
        const fbUrl = await uploadFile(exp.img, path.basename(exp.img), "/experts");
        
        await supabase.from("doctors").upsert({
            name_ar: exp.name_ar,
            name_en: exp.name_en,
            role_ar: exp.role_ar,
            role_en: exp.role_en,
            img: fbUrl || exp.img
        }, { onConflict: 'name_en' }); // Fallback conflict resolution
    }

    // 2. Migrate Products
    const productsContent = fs.readFileSync("src/data/products.json", "utf-8");
    const { products } = JSON.parse(productsContent);
    for (const prod of products) {
        console.log(`Processing Product: ${prod.id}`);
        const fbUrl = await uploadFile(prod.mainImage, path.basename(prod.mainImage), "/products");
        
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
        if (error) console.error(`DB Error (${prod.id}):`, error.message);
    }

    console.log("🏁 Final Migration Complete!");
}

run();
