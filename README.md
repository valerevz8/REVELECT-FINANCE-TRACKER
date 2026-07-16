# Revelect Finance Tracker

Aplikasi finance tracker yang connect ke Supabase (data kesimpen di cloud, bisa dibuka dari HP/tablet/laptop mana aja).

## 1. Isi kunci Supabase

1. Buka project Supabase kamu (yang sama kaya buat Revelect trading).
2. Klik ikon ⚙️ **Project Settings** → **API**.
3. Copy dua hal ini:
   - **Project URL**
   - **anon public key**
4. Di folder project ini, copy file `.env.example` jadi file baru bernama `.env`
5. Buka `.env`, isi kayak gini:

```
VITE_SUPABASE_URL=https://xxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi....(panjang)
```

## 2. Coba jalanin di laptop dulu (opsional, buat ngecek)

Buka Terminal di folder ini, ketik:

```
npm install
npm run dev
```

Nanti muncul link kayak `http://localhost:5173` — buka di browser, coba daftar akun & login. Kalau tabel-tabel Supabase udah kebuat (kemarin udah beres), harusnya langsung bisa pakai.

## 3. Upload ke GitHub

1. Bikin repo baru di GitHub, misal nama `revelect-finance`.
2. Upload semua isi folder ini ke repo itu (drag & drop di GitHub web juga bisa, atau `git push` kalau familiar).

## 4. Deploy ke Netlify

1. Buka [netlify.com](https://app.netlify.com), login.
2. Klik **Add new site** → **Import an existing project**.
3. Pilih repo GitHub `revelect-finance` yang tadi.
4. Build command udah otomatis kebaca dari `netlify.toml` (`npm run build`, publish folder `dist`) — ga usah diubah.
5. **PENTING**: sebelum klik Deploy, buka bagian **Environment variables**, tambahin 2 baris yang sama kayak di `.env` kamu:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Klik **Deploy site**. Tunggu 1-2 menit.
7. Selesai — Netlify kasih kamu URL kayak `random-name-123.netlify.app`. Itu udah bisa dibuka dari HP, tablet, laptop, di mana aja.

## 5. (Opsional) Custom domain

Kalau mau alamatnya jadi bagian dari domain Revelect kamu (misal `finance.revelect.app`), di Netlify: **Site settings → Domain management → Add a domain**, ikutin instruksinya (tinggal nambahin DNS record di provider domain kamu).

## Catatan

- Setiap orang yang daftar akun sendiri = data mereka otomatis terpisah & aman (karena Row Level Security di Supabase).
- Kalau mau ganti sistem login jadi satu sama Revelect trading (single login), itu langkah lanjutan — bilang aja nanti.
