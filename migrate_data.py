import os
import json
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.environ.get("SUPABASE_DB_URL")

def migrate_data():
    if not DB_URL:
        print("❌ لم يتم العثور على رابط قاعدة البيانات!")
        return

    print("جاري الاتصال بقاعدة بيانات Supabase لنقل البيانات...")
    try:
        conn = psycopg2.connect(DB_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # نقل بيانات الأطباء (Experts)
        if os.path.exists("src/data/experts.json"):
            with open("src/data/experts.json", "r", encoding="utf-8") as f:
                experts_data = json.load(f)
                experts = experts_data.get("experts", [])
                
                print(f"جاري إضافة {len(experts)} أطباء/خبراء...")
                for exp in experts:
                    cursor.execute("""
                        INSERT INTO doctors (name_ar, name_en, role_ar, role_en, img)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (
                        exp.get("name_ar", ""),
                        exp.get("name_en", ""),
                        exp.get("role_ar", ""),
                        exp.get("role_en", ""),
                        exp.get("img", "")
                    ))
        
        # نقل بيانات المنتجات (Products)
        if os.path.exists("src/data/products.json"):
            with open("src/data/products.json", "r", encoding="utf-8") as f:
                products_data = json.load(f)
                products = products_data.get("products", [])
                
                print(f"جاري إضافة {len(products)} منتجات...")
                for prod in products:
                    name = prod.get("name", {})
                    overview = prod.get("overview", {})
                    images_json = json.dumps(prod.get("images", []))
                    
                    cursor.execute("""
                        INSERT INTO products (id, name_ar, name_en, category, main_image, images, overview_ar, overview_en)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            name_ar=EXCLUDED.name_ar,
                            name_en=EXCLUDED.name_en,
                            category=EXCLUDED.category,
                            main_image=EXCLUDED.main_image,
                            images=EXCLUDED.images,
                            overview_ar=EXCLUDED.overview_ar,
                            overview_en=EXCLUDED.overview_en;
                    """, (
                        prod.get("id"),
                        name.get("ar", ""),
                        name.get("en", ""),
                        prod.get("category", ""),
                        prod.get("mainImage", ""),
                        images_json,
                        overview.get("ar", ""),
                        overview.get("en", "")
                    ))

        # نقل بيانات التثقيف الصحي (Education)
        if os.path.exists("src/data/education.json"):
            with open("src/data/education.json", "r", encoding="utf-8") as f:
                edu_data = json.load(f)
                
                articles = edu_data.get("articles", [])
                print(f"جاري إضافة {len(articles)} مقالات...")
                for art in articles:
                    cursor.execute("""
                        INSERT INTO articles (title_key, category_key, excerpt_key, img)
                        VALUES (%s, %s, %s, %s)
                    """, (art.get("title_key"), art.get("category_key"), art.get("excerpt_key"), art.get("img")))

                posters = edu_data.get("posters", [])
                print(f"جاري إضافة {len(posters)} بوسترات...")
                for post in posters:
                    cursor.execute("""
                        INSERT INTO posters (title_key, img)
                        VALUES (%s, %s)
                    """, (post.get("title_key"), post.get("img")))

        print("✅ تم نقل جميع البيانات بنجاح إلى Supabase!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ حدث خطأ أثناء النقل: \n{e}")

if __name__ == "__main__":
    migrate_data()
