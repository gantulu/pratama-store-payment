# pratama-store-payment

Demo integrasi Duitku (sandbox) menggunakan Node.js + Express. Siap deploy ke Railway.

## Isi repo
- server.js — server Express yang membuat invoice ke Duitku sandbox
- public/checkout.html — tampilan checkout (Tailwind via CDN)
- public/return.html — halaman return sederhana
- .env.example — contoh variabel lingkungan
- package.json

## Jalankan lokal
1. Copy `.env.example` ke `.env` dan isi `MERCHANT_KEY`.
2. `npm install`
3. `node server.js`
4. Buka `http://localhost:3000`

## Deploy ke Railway
1. Push repo ke GitHub.
2. Buat project baru di Railway → Deploy from GitHub.
3. Di Settings → Variables, tambahkan:
   - MERCHANT_CODE
   - MERCHANT_KEY
   - BASE_URL (contoh: https://your-app.up.railway.app)
   - USE_PRODUCTION (false untuk sandbox)
4. Deploy dan buka URL Railway.

## Catatan
- Ini demo untuk sandbox. Jangan simpan `MERCHANT_KEY` di repo publik.
- Di production, verifikasi signature callback untuk keamanan.