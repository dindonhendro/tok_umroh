# TokTok-Umroh (Korpri Umroh)

> **Platform Digital Marketplace Ibadah Umrah Terintegrasi Khusus Aparatur Sipil Negara (ASN) & Keluarga Inti KORPRI dengan Proteksi BSI Escrow Account.**

![TokTok-Umroh License](https://img.shields.io/badge/License-MIT-emerald)
![Tech Stack](https://img.shields.io/badge/Stack-Vite%20%7C%20React%20%7C%20TypeScript%20%7C%20TailwindCSS-teal)
![Database](https://img.shields.io/badge/Backend-Supabase%20PostgreSQL-059669)

---

## 🌟 Visi & Fitur Utama

TokTok-Umroh menghadirkan solusi marketplace ibadah umrah yang transparan, aman, dan memfasilitasi kemudahan pembiayaan syariah bagi jutaan ASN di seluruh Indonesia melalui sinergi Korps Pegawai Republik Indonesia (KORPRI) dan Bank Syariah Indonesia (BSI).

### 🕋 Tiga Pilar Produk Utama
1. **Paket Umroh (All-in):** Paket perjalanan lengkap (Reguler, Plus Wisata Halal Turki/Jordan/Aqsha, dan Spesial Purna Tugas KORPRI).
2. **Tiket Group (Early Booking Blok Seat):** Pemesanan alokasi kursian rombongan maskapai (Saudia Airlines, Garuda Indonesia, Lion Air) untuk Korpri Unit & instansi dinas dengan garansi nomor PNR.
3. **Paket Land Arrangement (LA):** Pengelolaan fasilitas darat Arab Saudi (hotel ring 1/2 Makkah-Madinah, bus VIP eksekutif, Kereta Cepat Haramain, muthawwif berizin, katering Nusantara, dan visa Muassasah).

### 🛡️ Proteksi BSI Escrow Account & Keamanan Transaksi
- **BSI Escrow System:** Dana jemaah ditampung sementara di rekening escrow resmi BSI.
- **Klausul Pencairan Bertahap:** Dana baru dapat dicairkan ke travel agen (PPIU) HANYA setelah kode PNR maskapai atau voucher hotel terverifikasi sah.
- **Garansi 100% Refund:** Jaminan pengembalian uang 100% tanpa potongan jika terjadi kendala kepastian keberangkatan dari pihak travel.

---

## 🚀 Stack Teknologi

- **Frontend Framework:** [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/) dengan tipografi *Plus Jakarta Sans* & *Amiri*
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend & Database:** [Supabase Cloud](https://supabase.com/) (Auth, PostgreSQL, Row Level Security, Storage)
- **Mitra Perbankan & Pembiayaan:** Bank Syariah Indonesia (BSI) via PKS Korpri Pusat

---

## ⚙️ Instalasi & Cara Menjalankan

### 1. Clone Repository & Install Dependensi
```bash
git clone https.github.com/dindonhendro/tok_umroh.git
cd tok_umroh
npm install
```

### 2. Konfigurasi Environment Variables (`.env`)
Buat file `.env` di root direktori dengan menyalin dari `.env.example`:
```env
VITE_SUPABASE_URL=https://ohmdvvbrmxquzfqgafje.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Setup Skema Database Supabase
Salin dan jalankan skrip DDL SQL di [Supabase SQL Editor](https://supabase.com/dashboard/project/ohmdvvbrmxquzfqgafje/sql/new):
- DDL Tabel & RLS: [`supabase/schema.sql`](./supabase/schema.sql)
- 10 Data Dummy Testing: [`supabase/seed_10_dummy.sql`](./supabase/seed_10_dummy.sql)

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka `http://localhost:5173` di browser Anda.

---

## 📋 Dokumentasi PRD

Dokumen kebutuhan produk lengkap dapat dilihat pada [docs/PRDinit.md](./docs/PRDinit.md).

---

## 📄 Lisensi

© 2026 TokTok-Umroh (Korpri Umroh). Platform Resmi Sinergi KORPRI & Bank Syariah Indonesia.
