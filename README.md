# G-Care Medical Co. | شركة جي كير الطبية

[![Production Status](https://img.shields.io/badge/Status-Active-success.svg)](https://gcare.sa)
[![Technological Stack](https://img.shields.io/badge/Stack-SolidJS%20%2B%20Supabase-blue.svg)](https://solidjs.com)

هذا المستودع يحتوي على الكود المصدري الرسمي لموقع شركة جي كير الطبية، وهو موقع مؤسسي متكامل يتضمن لوحة تحكم إدارية متطورة لإدارة المحتوى والخدمات والمنشورات الطبية.

This repository contains the official source code for the G-Care Medical Co. corporate website, including an advanced administrative dashboard for comprehensive management of content, services, and medical publications.

---

## التقنيات المستخدمة | Technological Stack

- **Frontend Framework**: SolidJS (Vite Build Tool)
- **Backend & Authentication**: Supabase
- **Cloud Storage**: ImageKit.io
- **Deployment Infrastructure**: Custom Python FTP Integration

---

## بيئة التطوير والتشغيل | Local Development

### المتطلبات التقنية | Prerequisites

- Node.js (Version 18.x or higher)
- npm (Version 9.x or higher)
- Python (Version 3.x for deployment scripts)

### تعليمات الإعداد | Setup Instructions

1. **تثبيت الملحقات البرمجية | Install dependencies:**

   ```bash
   npm install
   ```

2. **تهيئة متغيرات البيئة | Environment Configuration:**
   يتطلب تشغيل المشروع وجود ملف `.env` في المجلد الرئيسي يحتوي على مفاتيح الربط الخاصة بـ (Supabase & ImageKit).
   The project requires a `.env` file in the root directory containing valid authentication keys for Supabase and ImageKit services.

3. **بدأ تشغيل بيئة التطوير | Start development server:**

   ```bash
   npm run dev
   ```

4. **تجميع الملفات النهائية | Production Build:**

   ```bash
   npm run build
   ```

---

## هيكلية ملفات المشروع | Project Structure

- `src/`: الأكواد المصدرية والمكونات المنطقية للمشروع.
- `public/`: الوسائط والملفات الثابتة.
- `dist/`: المخرجات النهائية الجاهزة للنشر المباشر.
- `setup_db.py`: معالج تهيئة جداول قاعدة البيانات.
- `deploy_ftp.py`: أداة الأتمتة الخاصة بالرفع للسيرفر الرئيسي.

---

## النشر وإدارة التحديثات | Deployment Management

تم دمج أداة مخصصة بلغة بايثون لتسهيل عملية النشر الآلي لبيئة الإنتاج عبر بروتوكول FTP لضمان استمرارية الخدمة:

A specialized Python automation tool is integrated to facilitate seamless deployment to the production environment via FTP, ensuring service continuity:

```bash
python deploy_ftp.py
```

---

## الضمان والدعم الفني | Technical Support & Warranty

تلتزم إدارة المشروع بتقديم دعم فني تقني شامل لمدة خمسة (5) أشهر من تاريخ التسليم النهائي، وذلك لضمان استقرار الأنظمة البرمجية ومعالجة أي خلل تقني طارئ.

The project management is committed to providing comprehensive technical support for a period of five (5) months from the final delivery date, ensuring system stability and addressing any technical malfunctions.

---

**Developed by: Haitham Hathan | هيثم هتان**
**Date: April 2026**
