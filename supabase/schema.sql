-- ==============================================================================
-- Schema Supabase TokTok-Umroh (Korpri Umroh)
-- Sesuai Product Requirement Document (PRDinit.md)
-- ==============================================================================

-- 1. Tabel Profil ASN & Anggota KORPRI
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nip VARCHAR(18) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  instansi VARCHAR(255) NOT NULL,
  jabatan VARCHAR(100),
  nomor_hp VARCHAR(20) NOT NULL,
  bsi_account_number VARCHAR(50),
  role VARCHAR(30) DEFAULT 'ASN_MEMBER' CHECK (role IN ('ASN_MEMBER', 'KOORDINATOR_INSTANSI', 'ADMIN_KORPRI', 'SUPERADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Biro Travel (PPIU Berizin Resmi Kemenag RI)
CREATE TABLE IF NOT EXISTS ppiu_agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_travel VARCHAR(255) NOT NULL,
  nomor_izin_kemenag VARCHAR(100) UNIQUE NOT NULL,
  akreditasi VARCHAR(10) DEFAULT 'A',
  alamat TEXT,
  kontak_darurat VARCHAR(50),
  status_verifikasi BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1) DEFAULT 4.9,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Master Produk (Paket Umroh, Tiket Group, Paket LA)
CREATE TABLE IF NOT EXISTS products (
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
  min_pax_order INT NOT NULL DEFAULT 1,
  
  -- Harga & Finansial
  harga_per_pax NUMERIC(14,2) NOT NULL,
  mata_uang VARCHAR(5) DEFAULT 'IDR',
  
  -- Spesifikasi Khusus Penerbangan (Paket Umroh & Tiket Group)
  nama_maskapai VARCHAR(100),
  rute_penerbangan VARCHAR(100),
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
  image_url TEXT,
  
  -- Detail Fasilitas & Itinerary (JSONB)
  fasilitas_termasuk JSONB,
  fasilitas_tidak_termasuk JSONB,
  itinerary_detail JSONB,
  
  status_aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Transaksi Booking & Escrow BSI
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(30) UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  
  tipe_pemesan VARCHAR(30) DEFAULT 'INDIVIDU' CHECK (tipe_pemesan IN ('INDIVIDU', 'KELUARGA', 'ROMBONGAN_INSTANSI')),
  jumlah_pax INT NOT NULL,
  data_jemaah JSONB NOT NULL,
  
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

-- ==============================================================================
-- Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppiu_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy Profiles
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policy PPIU Agencies
CREATE POLICY "Public read verified agencies" ON ppiu_agencies FOR SELECT USING (status_verifikasi = true);

-- Policy Products
CREATE POLICY "Public read active products" ON products FOR SELECT USING (status_aktif = true);

-- Policy Bookings
CREATE POLICY "Users read own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users update own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- SEED DATA AWAL (Contoh PPIU & 3 Pilar Produk)
-- ==============================================================================
INSERT INTO ppiu_agencies (id, nama_travel, nomor_izin_kemenag, akreditasi, alamat, kontak_darurat, status_verifikasi, rating)
VALUES 
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'PT Korpri Mandiri Wisata (KMW)', 'PPIU No. 412/2021', 'A', 'Gedung KORPRI Pusat Jl. Medan Merdeka Utara, Jakarta', '0811-9876-5432', true, 4.9),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'PT Al-Barkah Syariah Express', 'PPIU No. 823/2019', 'A', 'Jl. Fatmawati No. 45, Jakarta Selatan', '0812-3456-7890', true, 4.8),
  ('c3d4e5f6-a1b2-4c3d-ae4f-5a6b7c8d9e0f', 'PT Madinah Iman Wisata', 'PPIU No. 129/2020', 'A', 'Jl. Pemuda No. 88, Surabaya', '0813-9012-3456', true, 4.9)
ON CONFLICT (nomor_izin_kemenag) DO NOTHING;

-- Seed Produk: Paket Umroh
INSERT INTO products (
  id, agency_id, tipe_produk, nama_produk, kategori_paket, kota_keberangkatan,
  tanggal_keberangkatan, durasi_hari, total_kuota_seat, sisa_seat, min_pax_order,
  harga_per_pax, nama_maskapai, rute_penerbangan, hotel_makkah, bintang_hotel_makkah,
  jarak_makkah_meter, hotel_madinah, bintang_hotel_madinah, jarak_madinah_meter,
  jenis_transportasi, include_kereta_cepat, image_url, fasilitas_termasuk
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
  'PAKET_UMROH',
  'Umroh Reguler Eksekutif KORPRI Berkah 9 Hari',
  'REGULER',
  'Jakarta (CGK)',
  CURRENT_DATE + INTERVAL '45 days',
  9, 45, 14, 1,
  28500000,
  'Garuda Indonesia (Direct)',
  'CGK - JED / MED - CGK',
  'Swissôtel Al Maqam Makkah', 5, 80,
  'Dallah Taibah Madinah', 5, 120,
  'Bus VIP Eksekutif Mercedes-Benz AC', true,
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80',
  '["Tiket PP Garuda Direct", "Visa Umrah & Asuransi KSA", "Hotel Bintang 5 Makkah & Madinah", "Makan Fullboard 3x Khas Nusantara", "Muthawwif Khusus Anggota ASN", "Air Zamzam 5 Liter", "Perlengkapan Koper Premium"]'
),
(
  '22222222-2222-2222-2222-222222222222',
  'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e',
  'PAKET_UMROH',
  'Umroh Plus Wisata Sejarah Turki & Istanbul 12 Hari',
  'PLUS_WISATA',
  'Jakarta (CGK)',
  CURRENT_DATE + INTERVAL '60 days',
  12, 40, 8, 1,
  36900000,
  'Turkish Airlines',
  'CGK - IST - JED - CGK',
  'Pullman Zamzam Makkah', 5, 100,
  'Frontel Al Harithia Madinah', 5, 150,
  'Bus Pariwisata Eksekutif', true,
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
  '["City Tour Istanbul Blue Mosque & Hagia Sophia", "Tiket PP Turkish Airlines", "Hotel Bintang 5 Dekat Masjid", "Visa Turki & Visa Umrah Kemenag", "Handling VIP Bandara"]'
);

-- Seed Produk: Tiket Group (Early Booking Blok Seat)
INSERT INTO products (
  id, agency_id, tipe_produk, nama_produk, kategori_paket, kota_keberangkatan,
  tanggal_keberangkatan, durasi_hari, total_kuota_seat, sisa_seat, min_pax_order,
  harga_per_pax, nama_maskapai, rute_penerbangan, kode_pnr_group, image_url, fasilitas_termasuk
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
  'TIKET_GROUP',
  'Early Booking Tiket Group Saudia Airlines Direct (Blok Seat)',
  'EARLY_BOOKING_GROUP',
  'Jakarta (CGK)',
  CURRENT_DATE + INTERVAL '30 days',
  9, 90, 32, 10,
  14850000,
  'Saudia Airlines (SV-819 Direct)',
  'CGK - JED / MED - CGK',
  'SV9KORPRI',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80',
  '["Tiket Direct Saudia Airlines", "Bagasi 2 x 23 kg", "Free Air Zamzam 5 Liter", "Name List Update H-14 Keberangkatan", "PNR Terverifikasi Garansi BSI Escrow"]'
),
(
  '44444444-4444-4444-4444-444444444444',
  'c3d4e5f6-a1b2-4c3d-ae4f-5a6b7c8d9e0f',
  'TIKET_GROUP',
  'Tiket Group Rombongan Garuda Indonesia Sub-Hub Surabaya',
  'EARLY_BOOKING_GROUP',
  'Surabaya (SUB)',
  CURRENT_DATE + INTERVAL '50 days',
  10, 60, 24, 10,
  15600000,
  'Garuda Indonesia (GA-984)',
  'SUB - JED / JED - SUB (Direct)',
  'GA8SUBKRP',
  'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1000&q=80',
  '["Penerbangan Langsung dari Bandara Juanda", "Bagasi 30kg + 7kg Kabin", "Termasuk Airport Tax & Surcharge", "Garansi Seat Rombongan Utuh"]'
);

-- Seed Produk: Paket Land Arrangement (LA)
INSERT INTO products (
  id, agency_id, tipe_produk, nama_produk, kategori_paket, kota_keberangkatan,
  tanggal_keberangkatan, durasi_hari, total_kuota_seat, sisa_seat, min_pax_order,
  harga_per_pax, hotel_makkah, bintang_hotel_makkah, jarak_makkah_meter,
  hotel_madinah, bintang_hotel_madinah, jarak_madinah_meter, jenis_transportasi,
  include_kereta_cepat, image_url, fasilitas_termasuk
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
  'PAKET_LA',
  'Paket Land Arrangement (LA) VIP Ring 1 + Kereta Cepat Haramain',
  'CUSTOM_LA',
  'Jeddah / Madinah',
  CURRENT_DATE + INTERVAL '20 days',
  9, 120, 48, 15,
  11200000,
  'Mövenpick Hotel & Residences Hajar Tower Makkah', 5, 50,
  'Anwar Al Madinah Mövenpick', 5, 60,
  'Bus Mercedes Travego VIP 2024 & Haramain Speed Train', true,
  'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1000&q=80',
  '["Visa Umrah & Asuransi Kemenag KSA", "Hotel Ring 1 Masjidil Haram (50m)", "Hotel Ring 1 Masjid Nabawi (60m)", "Tiket Kereta Cepat Haramain Makkah-Madinah", "Muthawwif Mukimin S2 Berlisensi", "Katering 3x Sehari Masakan Padang / Sunda / Jawa", "Tim Handling Airport 24 Jam"]'
),
(
  '66666666-6666-6666-6666-666666666666',
  'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e',
  'PAKET_LA',
  'Paket Land Arrangement (LA) Reguler Hemat Rombongan Dinas KORPRI',
  'CUSTOM_LA',
  'Jeddah / Madinah',
  CURRENT_DATE + INTERVAL '25 days',
  9, 100, 35, 20,
  8300000,
  'Le Méridien Towers Makkah (Shuttle 24 Jam)', 4, 300,
  'Rove Al Madinah', 4, 200,
  'Bus Eksekutif Yutong AC 2023', false,
  'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1000&q=80',
  '["Visa Umrah Elektronik", "Hotel Bintang 4 Bersih & Nyaman", "Bus AC Dingin Transfer Makkah-Madinah-Jeddah", "Ziarah Kota Makkah (Jabal Rahmah, Mina) & Madinah (Quba, Uhud)", "Handling Kelancaran Tasreeh Raudhah Nusuk"]'
);
