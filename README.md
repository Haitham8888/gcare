# G-Care Medical Co. | شركة جي كير الطبية 🏥

[![Website Status](https://img.shields.io/badge/Status-Live-success.svg)](https://gcare.sa)
[![Tech Stack](https://img.shields.io/badge/Stack-SolidJS%20%2B%20Supabase-blue.svg)](https://solidjs.com)

هذا المستودع يحتوي على الكود المصدري لموقع **شركة جي كير الطبية**، وهو موقع تعريفي متكامل مع لوحة تحكم إدارية متطورة لإدارة المحتوى والمنتجات والمقالات الطبية.

This repository contains the source code for the **G-Care Medical Co.** website, profiling a full corporate site integrated with an advanced administrative dashboard for content, product, and medical article management.

---

## 🛠️ تقنيات المشروع | Tech Stack

- **Frontend**: [SolidJS](https://www.solidjs.com/) (Vite)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Media Hosting**: [ImageKit.io](https://imagekit.io/)
- **Deployment**: Custom Python FTP Deployer

---

## 🚀 التشغيل والتطوير | Local Development

### المتطلبات | Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Python**: v3.x (for deployment scripts)

### خطوات التشغيل | Setup Instructions

1. **تثبيت المكتبات | Install dependencies:**

   ```bash
   npm install
   ```

2. **ملف الإعدادات | Environment Variables:**
   تأكد من وجود ملف `.env` في جذر المشروع يحتوي على الروابط والمفاتيح البرمجية (API Keys).
   Make sure to have a `.env` file in the root with necessary Supabase and ImageKit credentials.

3. **تشغيل الموقع محلياً | Start development server:**

   ```bash
   npm run dev
   ```

4. **بناء النسخة النهائية | Production Build:**

   ```bash
   npm run build
   ```

---

## 📂 هيكلية المجلدات | Folder Structure

- `src/`: الأكواد البرمجية والمكونات (Components & Logic).
- `public/`: الصور والملفات الثابتة (Static Assets).
- `dist/`: المخرجات النهائية الجاهزة للنشر (Built Assets).
- `setup_db.py`: سكربت تهيئة قاعدة البيانات (Database initialization).
- `deploy_ftp.py`: أداة الرفع الآلي للسيرفر (Automatic Deployment script).

---

## 🏗️ النشر والتحديث | Deployment

تم توفير سكربت خاص بلغة بايثون للقيام بعملية النشر التلقائي للسيرفر الرئيسي عبر بروتوكول FTP:

We provided a custom Python script for automatic deployment to the main production server via FTP:

```bash
python deploy_ftp.py
```

---

## 📞 الدعم الفني | Technical Support

يتمتع العميل بفترة دعم فني مجانية لمدة **5 أشهر** من تاريخ التسليم النهائي لضمان استقرار التشغيل وصيانة أي أخطاء برمجية.

The client is entitled to **5 months** of complimentary technical support from the final delivery date to ensure operational stability and bug fixes.

---

**Developed by: Haitham Hathan | هيثم هتان**
**Date: April 2026**
