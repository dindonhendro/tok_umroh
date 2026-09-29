# Product Requirement Document (PRD): TokTok-Umroh (Korpri Umroh)

**Nama Produk:** TokTok-Umroh (Korpri Umroh)  
**Versi:** 1.1 (MVP Phase - Multi-Product Catalog Extension)  
**Target Pengguna:** Aparatur Sipil Negara (ASN) di bawah naungan KORPRI, keluarga inti, serta koordinator rombongan instansi & PPIU  
**Stack Teknologi:** Vite (React + TypeScript) & Supabase (Auth, Database, Storage, Edge Functions)  
**Mitra Pembiayaan Utama (MVP):** Bank Syariah Indonesia (BSI) via PKS Korpri Pusat (Arsitektur mendukung ekspansi ke Bank Umum lainnya)  

---

## 1. Visi & Tujuan Produk

TokTok-Umroh (Korpri Umroh) hadir sebagai platform digital marketplace ibadah umrah terintegrasi yang dikhususkan bagi anggota KORPRI (ASN) beserta keluarganya. Mengadaptasi ekosistem teruji dari model bisnis marketplace umrah terkemuka, platform ini memecahkan masalah risiko penipuan biro umrah melalui transparansi data travel berizin Kemenag RI, kepastian ketersediaan inventori, serta jaminan keamanan transaksi berbasis escrow account.

Platform menyediakan 3 pilar produk utama dalam satu ekosistem:
1. **Paket Umroh (All-in):** Paket lengkap siap berangkat untuk individu, keluarga, dan rombongan ASN.
2. **Tiket Group (Early Booking):** Pemesanan tiket pesawat blok seat grup maskapai ternama dengan harga kompetitif dan kepastian PNR.
3. **Paket Land Arrangement (LA):** Solusi layanan darat di Tanah Suci (hotel, visa, bus eksekutif, muthawwif, katering) bagi rombongan instansi maupun travel rekanan.

### Tujuan Utama (MVP):
- **Verifikasi Terpusat:** Menghubungkan ASN secara langsung dengan Penyelenggara Perjalanan Ibadah Umrah (PPIU) resmi berizin Kemenag RI.
- **Keamanan Transaksi 100%:** Menerapkan skema penampungan dana (escrow) yang aman dengan klausul pencairan dana berbasis penerbitan kode booking pesawat (PNR) dan konfirmasi voucher hotel/LA.
- **Transparansi & Kemudahan Pencarian:** Menghadirkan *Search Engine* terpadu dengan filter cepat per kategori produk (Paket Umroh, Tiket Group, Paket LA), kota keberangkatan, waktu keberangkatan, dan harga.
- **Kemudahan Pembiayaan & Tabungan ASN:** Mengintegrasikan fasilitas skema tabungan dan pembiayaan syariah dari Bank Syariah Indonesia (BSI) yang telah terikat PKS dengan Korpri Pusat.

---

## 2. Target User & Persona

| Kategori User | Deskripsi | Kebutuhan Utama |
| :--- | :--- | :--- |
| **ASN (Anggota KORPRI)** | Pegawai Negeri Sipil & PPPK aktif dari berbagai instansi/kementerian. | Kepastian keberangkatan, fleksibilitas skema pembiayaan (pemotongan gaji/tabungan BSI), perbandingan paket transparan, serta kemudahan mendaftarkan anggota keluarga. |
| **Keluarga ASN** | Orang tua, pasangan, dan anak dari ASN. | Paket umrah ramah keluarga/lansia, transparansi fasilitas hotel/maskapai, serta panduan ibadah digital terintegrasi. |
| **Koordinator Rombongan Instansi (KORPRI Unit/Pemda)** | Pengurus KORPRI di tingkat Kementerian, Lembaga, atau Pemda yang mengorganisir rombongan delegasi dinas/kelompok besar. | Pemesanan Tiket Group berkapasitas besar (blok seat), kustomisasi Paket Land Arrangement (LA) delegasi, dan invoice korporat. |
| **Biro Travel (PPIU Terverifikasi)** | Biro travel umrah yang mengantongi izin resmi Kemenag RI. | Channel distribusi khusus untuk menjangkau jutaan ASN nasional, inventori tiket group & LA grosir, serta kepastian pembayaran melalui escrow. |
| **Admin KORPRI & BSI** | Pengelola program dari Korpri Pusat dan tim verifikator pembiayaan BSI. | Dashboard monitoring pendaftaran, status pembiayaan syariah ASN, verifikasi dokumen, serta validasi transaksi escrow. |

---

## 3. Arsitektur & Tech Stack

```text
[ Frontend: Vite + React + Tailwind CSS ]
  ├── Hero Unified Search Engine (Tab: Tiket Group, Paket LA, Paket Umroh)
  ├── Filter Engine (Kota, Waktu/Bulan, Budget, Fasilitas, Maskapai)
  ├── Detail View & Dynamic Booking Flow
  └── Dashboard User (ASN, Koordinator, PPIU, Admin)
                  │
                  ▼
[ Backend & Database: Supabase Platform ]
  ├── Auth (NIP ASN / Email / OAuth KORPRI)
  ├── PostgreSQL Database (RLS Enabled - Packages, LA, Group Tickets, Bookings)
  ├── Storage (Dokumen Paspor, KTP, Kartu KORPRI, Bukti PNR & Voucher LA)
  └── Edge Functions (Integrasi API BSI, Validasi PNR & Business Logic)
                  │
                  ▼
[ External API Services ]
  ├── BSI Gateway (Escrow, Pembiayaan Payroll, Autodebet Tabungan)
  ├── KORPRI SSO / NIP Verification Service
  ├── Kemenag PPIU Database API (Status Izin & Akreditasi Travel)
  └── GDS / Airlines Booking Engine (Sinkronisasi PNR Maskapai)
```

---

## 4. Rincian Modul & Tiga Pilar Layanan Utama

### 4.1. Modul Pencarian & Filter Terpadu (Unified Hero Search Bar)
Platform menyediakan *search widget* interaktif pada homepage dengan 3 tab navigasi utama:
- **Tab Switcher Produk:**
  1. `Tiket Group [Early Booking]`
  2. `Paket LA (Land Arrangement)`
  3. `Paket Umroh`
- **Parameter Filter Instan:**
  - **Kota Keberangkatan:** Jakarta (CGK), Surabaya (SUB), Solo (SOC), Medan (KNO), Makassar (UPG), dll.
  - **Waktu Keberangkatan:** Pilihan bulan keberangkatan (misal: Rajab, Sya'ban, Ramadhan, Syawal, atau kalender Masehi).
  - **Rentang Harga:** Filter slider rentang harga ekonomis hingga bintang 5/VIP.
  - **Filter Tambahan:** Maskapai (Garuda, Saudia, Lion Air, Emirates, dll.), Bintang Hotel (Bintang 3/4/5), Jarak Hotel ke Masjid (< 100m, 100-300m, > 300m), Tipe Kamar (Quad, Triple, Double).

---

### 4.2. Spesifikasi Tiga Pilar Produk

#### A. Pilar 1: Paket Umroh (All-in Package)
Ditujukan untuk ASN dan keluarga yang menginginkan perjalanan ibadah tanpa repot (siap berangkat).
- **Kategori Paket:**
  - **Umroh Reguler:** Durasi 9 - 12 hari dengan fasilitas hotel bintang 3–5 di Makkah & Madinah.
  - **Umroh Plus Wisata Halal:** Kombinasi umrah dengan destinasi sejarah Islam (Turki, Mesir, Dubai, Uzbekistan, Jordan).
  - **Umroh Spesial Tokoh/KORPRI:** Paket bimbingan khusus bersama asatidz ternama atau rombongan khusus purna tugas ASN.
- **Komponen Layanan (All-Inclusive):**
  - Tiket pesawat PP (direct/transit) kelas ekonomi/bisnis.
  - Visa Umrah resmi dan asuransi perjalanan wajib dari Muassasah Arab Saudi.
  - Akomodasi hotel di Madinah & Makkah sesuai klasifikasi bintang.
  - Transportasi bus AC eksekutif selama ziarah dan transfer kota.
  - Konsumsi fullboard menu khas Nusantara (3x sehari).
  - Pembimbing ibadah (Muthawwif) tersertifikasi bahasa Indonesia & Tour Leader.
  - Handling bandara di Indonesia dan Arab Saudi, perlengkapan ibadah lengkap (koper, kain ihram/mukena, tas selempang, buku doa).

#### B. Pilar 2: Tiket Group (Penerbangan Rombongan / Blok Seat)
Ditujukan bagi KORPRI Unit, rombongan instansi/kementerian, maupun biro PPIU yang membutuhkan alokasi kursi penerbangan dalam jumlah besar dengan harga kompetitif.
- **Fitur Utama:**
  - **Early Booking Advantage:** Akses pemesanan kuota tiket jauh hari sebelum musim puncak (High Season/Ramadhan/Libur Akhir Tahun).
  - **Minimal Pemesanan:** Blok seat rombongan (mulai dari minimal 10 seat hingga ratusan seat).
  - **Pilihan Maskapai Terpercaya:** Saudia Airlines, Garuda Indonesia, Oman Air, Qatar Airways, Emirates, Scoot, Lion Group.
  - **Rute Langsung & Transit:** Jakarta/Surabaya/Solo menuju Jeddah (JED) atau Madinah (MED).
  - **Transparansi Status PNR & E-Ticket:** Nomor PNR grup, batas waktu deposit, batas waktu issuing nama jemaah (*name list submission*), dan bagasi 2x23kg/30kg + air zamzam.

#### C. Pilar 3: Paket Land Arrangement / LA (Layanan Darat Arab Saudi)
Ditujukan untuk rombongan instansi mandiri, delegasi resmi ASN, atau travel agen PPIU yang telah memiliki tiket penerbangan dan membutuhkan pengelolaan fasilitas darat profesional di Arab Saudi.
- **Komponen Layanan Darat (LA):**
  - **Visa Umrah & Tasreeh:** Pengurusan visa resmi KSA, asuransi kesehatan Arab Saudi, dan izin tasreeh Raudhah via aplikasi Nusuk.
  - **Hotel Booking (Makkah & Madinah):** Reservasi kamar (Quad, Triple, Double) di hotel ring 1 atau ring 2 Masjidil Haram & Masjid Nabawi dengan garansi konfirmasi voucher hotel.
  - **Transportasi Darat Berstandar Tinggi:** Bus eksekutif model terbaru (Mercedes-Benz/Yutong VIP AC), transfer bandara Jeddah/Madinah, serta opsi tiket Kereta Cepat Haramain (Haramain High Speed Railway).
  - **Handling & Tim Operasional:** Tim airport handling profesional di Bandara King Abdulaziz Jeddah dan Prince Mohammad Madinah.
  - **Muthawwif & Tour Guide Berizin:** Pendampingan ibadah profesional oleh mahasiswa/mukimin berizin resmi di Arab Saudi.
  - **Katering Menu Nusantara:** Layanan konsumsi boks atau prasmanan sesuai selera jemaah Indonesia.
  - **Paket Ziarah/City Tour:** Kunjungan bersejarah di Makkah (Jabal Tsur, Arafah, Mina, Mudzalifah, Jabal Nur) dan Madinah (Masjid Quba, Jabal Uhud, Kebun Kurma, Percetakan Al-Qur'an).

---

### 4.3. Modul Keamanan Transaksi & Escrow System
- **BSI Escrow Account Integration:** Dana pembayaran jemaah atau instansi ditampung sementara dalam rekening penampungan aman Bank Syariah Indonesia.
- **Pencairan Bertahap Berbasis Milestone (PNR & Voucher LA):**
  - Untuk Paket Umroh & Tiket Group: Dana diteruskan ke maskapai/PPIU setelah kode booking PNR resmi terverifikasi aktif.
  - Untuk Paket LA: Dana dicairkan setelah voucher hotel dan izin visa Muassasah diterbitkan.
- **Garansi 100% Refund (Uang Kembali):** Jika pihak travel/vendor gagal menerbitkan PNR sah atau voucher konfirmasi dalam batas SLA yang disepakati, sistem secara otomatis mengeksekusi pengembalian dana 100% tanpa potongan.

---

### 4.4. Modul Pembiayaan & Tabungan Umrah BSI (Korpri Synergy)
- **Verifikasi Keanggotaan KORPRI:** Validasi instan nomor NIP ASN dan basis data kepegawaian.
- **Pembiayaan Umrah Payroll BSI:** ASN dapat mengajukan cicilan syariah dengan tenor hingga 36 bulan dengan skema pemotongan payroll BSI.
- **Tabungan Umrah Terencana (Autodebet):** Fitur menabung otomatis bulanan bagi ASN untuk target keberangkatan Paket Umroh, Tiket Group, maupun paket keluarga.

---

### 4.5. Fitur Pendukung Ibadah & Perencanaan Finansial
- **Kalkulator Biaya Umrah Rombongan & Keluarga:** Estimasi otomatis simulasi biaya paket, add-on kamar double/single, hingga perhitungan tiket grup.
- **Asisten Ibadah Digital:** Pengingat waktu sholat lokal (WIB/KSA), kompas kiblat, Al-Qur'an digital, panduan manasik doa audio, dan peta interaktif Masjidil Haram & Nabawi.

---

## 5. Skema Data Utama (Supabase PostgreSQL)

```sql
-- 1. Tabel Profil ASN & Anggota KORPRI
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nip VARCHAR(18) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  instansi VARCHAR(255) NOT NULL,
  jabatan VARCHAR(100),
  nomor_hp VARCHAR(20) NOT NULL,
  bsi_account_number VARCHAR(50),
  role VARCHAR(30) DEFAULT 'ASN_MEMBER' CHECK (role IN ('ASN_MEMBER', 'KOORDINATOR_INSTANSI', 'ADMIN_KORPRI', 'SUPERADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Travel Agen (PPIU) & Vendor Penyedia
CREATE TABLE ppiu_agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_travel VARCHAR(255) NOT NULL,
  nomor_izin_kemenag VARCHAR(100) UNIQUE NOT NULL,
  akreditasi VARCHAR(10) DEFAULT 'A',
  alamat TEXT,
  kontak_darurat VARCHAR(50),
  status_verifikasi BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2,1) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Master Produk (Paket Umroh, Tiket Group, Paket LA)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES ppiu_agencies(id) ON DELETE CASCADE,
  tipe_produk VARCHAR(30) NOT NULL 
    CHECK (tipe_produk IN ('PAKET_UMROH', 'TIKET_GROUP', 'PAKET_LA')),
  nama_produk VARCHAR(255) NOT NULL,
  kategori_paket VARCHAR(50) 
    CHECK (kategori_paket IN ('REGULER', 'PLUS_WISATA', 'SPESIAL_TOKOH', 'VIP_EXECUTIVE', 'EARLY_BOOKING_GROUP', 'CUSTOM_LA')),
  
  -- Info Perjalanan & Kuota
  kota_keberangkatan VARCHAR(100) NOT NULL,
  tanggal_keberangkatan DATE NOT NULL,
  durasi_hari INT NOT NULL DEFAULT 9,
  total_kuota_seat INT NOT NULL,
  sisa_seat INT NOT NULL,
  min_pax_order INT NOT NULL DEFAULT 1, -- Misal Tiket Group min 10 pax
  
  -- Harga & Finansial
  harga_per_pax NUMERIC(14,2) NOT NULL,
  mata_uang VARCHAR(5) DEFAULT 'IDR',
  
  -- Spesifikasi Khusus Penerbangan (Paket Umroh & Tiket Group)
  nama_maskapai VARCHAR(100),
  rute_penerbangan VARCHAR(100), -- 'CGK - JED (Direct)', 'SUB - MED (Transit)', dll.
  kode_pnr_group VARCHAR(50),
  
  -- Spesifikasi Khusus Akomodasi & LA (Paket Umroh & Paket LA)
  hotel_makkah VARCHAR(150),
  bintang_hotel_makkah INT CHECK (bintang_hotel_makkah BETWEEN 3 AND 5),
  jarak_makkah_meter INT,
  hotel_madinah VARCHAR(150),
  bintang_hotel_madinah INT CHECK (bintang_hotel_madinah BETWEEN 3 AND 5),
  jarak_madinah_meter INT,
  jenis_transportasi VARCHAR(100) DEFAULT 'Bus VIP Eksekutif AC',
  include_kereta_cepat BOOLEAN DEFAULT FALSE,
  
  -- Detail Fasilitas & Itinerary (JSONB)
  fasilitas_termasuk JSONB, -- ['Tiket PP', 'Visa', 'Handling', 'Katering', ...]
  fasilitas_tidak_termasuk JSONB,
  itinerary_detail JSONB,
  
  status_aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Transaksi Booking & Escrow BSI
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(30) UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  product_id UUID REFERENCES products(id),
  
  tipe_pemesan VARCHAR(30) DEFAULT 'INDIVIDU' CHECK (tipe_pemesan IN ('INDIVIDU', 'KELUARGA', 'ROMBONGAN_INSTANSI')),
  jumlah_pax INT NOT NULL,
  data_jemaah JSONB NOT NULL, -- Array jemaah (nama, no_paspor, NIP ASN jika ada, jenis kamar)
  
  total_harga NUMERIC(14,2) NOT NULL,
  metode_pembayaran VARCHAR(50) 
    CHECK (metode_pembayaran IN ('BSI_CASH_VA', 'BSI_PEMBIAYAAN_PAYROLL', 'BSI_TABUNGAN_AUTODEBET')),
  bsi_va_number VARCHAR(50),
  
  -- Bukti Verifikasi Escrow
  kode_pnr_verified VARCHAR(50),
  voucher_la_verified VARCHAR(100),
  
  status_escrow VARCHAR(50) DEFAULT 'PENDING_PAYMENT' 
    CHECK (status_escrow IN (
      'PENDING_PAYMENT',
      'ESCROW_LOCKED',
      'PNR_VERIFIED_RELEASED',
      'LA_CONFIRMED_RELEASED',
      'COMPLETED',
      'REFUND_REQUESTED',
      'REFUNDED_100%'
    )),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 6. Tahapan Pengembangan (MVP Roadmap)

- **Fase 1 (Sprint 1–2): Architecture Setup & Auth KORPRI**
  - Inisialisasi Vite (React + TS + Tailwind CSS) & Supabase project.
  - Implementasi Supabase Auth dengan otentikasi NIP ASN / Nomor Anggota KORPRI.
  - Pembuatan base layout dengan navbar terintegrasi: `Tiket Group`, `Paket LA`, `Paket Umroh`, serta auth portal.

- **Fase 2 (Sprint 3–4): Unified Search & Multi-Product Catalog**
  - Pembangunan hero banner dengan 3 tab selector (`Tiket Group [Early Booking]`, `Paket LA`, `Paket Umroh`).
  - Implementasi filter multi-parameter (Kota Keberangkatan, Waktu/Bulan, Rentang Harga, Bintang Hotel, Maskapai).
  - Halaman katalog per jenis produk dengan badge garansi resmi (*Izin Kemenag*, *Refund 100%*, *Mitra Resmi BSI*).
  - Panel PPIU untuk mengunggah dan mengelola inventori Paket Umroh, Tiket Group, dan Paket LA.

- **Fase 3 (Sprint 5–6): BSI Integration, Booking Engine & Escrow System**
  - Integrasi API BSI Virtual Account dan simulasi pengajuan cicilan payroll ASN.
  - Alur booking dinamis untuk perorangan, keluarga, dan rombongan instansi (minimum pax validator untuk Tiket Group).
  - Modul verifikasi kode PNR maskapai & voucher LA sebelum otorisasi pencairan dana escrow ke vendor.

- **Fase 4 (Sprint 7): Security Audit, RLS & Testing**
  - Pengujian alur transaksi menyeluruh (Happy path, simulasi pembatalan & verifikasi garansi 100% refund).
  - Konfigurasi Supabase Row Level Security (RLS) untuk data sensitif paspor, NIP, dan akun perbankan.
  - Optimasi responsivitas mobile web app untuk kemudahan akses ASN di berbagai perangkat.
