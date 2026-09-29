-- ==============================================================================
-- 10 DATA DUMMY PRODUK & BIRO TRAVEL UNTUK TESTING TOKTOK-UMROH (KORPRI UMROH)
-- Dijalankan di Supabase SQL Editor: https://supabase.com/dashboard/project/ohmdvvbrmxquzfqgafje/sql/new
-- ==============================================================================

-- 1. Tambah/Pastikan Biro Travel (PPIU) Resmi
INSERT INTO ppiu_agencies (id, nama_travel, nomor_izin_kemenag, akreditasi, alamat, kontak_darurat, status_verifikasi, rating)
VALUES 
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'PT Korpri Mandiri Wisata (KMW)', 'PPIU No. 412/2021', 'A', 'Gedung KORPRI Pusat Jl. Medan Merdeka Utara, Jakarta', '0811-9876-5432', true, 4.9),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'PT Al-Barkah Syariah Express', 'PPIU No. 823/2019', 'A', 'Jl. Fatmawati No. 45, Jakarta Selatan', '0812-3456-7890', true, 4.8),
  ('c3d4e5f6-a1b2-4c3d-ae4f-5a6b7c8d9e0f', 'PT Madinah Iman Wisata', 'PPIU No. 129/2020', 'A', 'Jl. Pemuda No. 88, Surabaya', '0813-9012-3456', true, 4.9),
  ('d4e5f6a1-b2c3-4d5e-bf6a-7b8c9d0e1f2a', 'PT Nusantara Barakah Tour', 'PPIU No. 910/2022', 'A', 'Jl. Asia Afrika No. 12, Bandung', '0814-5678-9012', true, 4.7)
ON CONFLICT (nomor_izin_kemenag) DO NOTHING;

-- 2. Hapus/Bersihkan produk lama jika ingin refresh data dummy
DELETE FROM products WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888',
  '99999999-9999-9999-9999-999999999999',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

-- 3. Inser 10 Data Produk Dummy Teruji
INSERT INTO products (
  id, agency_id, tipe_produk, nama_produk, kategori_paket, kota_keberangkatan,
  tanggal_keberangkatan, durasi_hari, total_kuota_seat, sisa_seat, min_pax_order,
  harga_per_pax, nama_maskapai, rute_penerbangan, kode_pnr_group, hotel_makkah, bintang_hotel_makkah,
  jarak_makkah_meter, hotel_madinah, bintang_hotel_madinah, jarak_madinah_meter,
  jenis_transportasi, include_kereta_cepat, image_url, fasilitas_termasuk
) VALUES 
-- Produk 1: Paket Umroh Reguler VIP
(
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
  'GA9KORPRI',
  'Swissôtel Al Maqam Makkah', 5, 80,
  'Dallah Taibah Madinah', 5, 120,
  'Bus VIP Eksekutif Mercedes-Benz AC', true,
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80',
  '["Tiket PP Garuda Direct", "Visa Umrah & Asuransi KSA", "Hotel Bintang 5 Makkah & Madinah", "Makan Fullboard 3x Khas Nusantara", "Muthawwif Khusus Anggota ASN", "Air Zamzam 5 Liter"]'
),

-- Produk 2: Paket Umroh Plus Wisata Turki
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
  'TK12IST',
  'Pullman Zamzam Makkah', 5, 100,
  'Frontel Al Harithia Madinah', 5, 150,
  'Bus Pariwisata Eksekutif', true,
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
  '["City Tour Istanbul Blue Mosque & Hagia Sophia", "Tiket PP Turkish Airlines", "Hotel Bintang 5 Dekat Masjid", "Visa Turki & Visa Umrah Kemenag"]'
),

-- Produk 3: Tiket Group Saudia Airlines Jakarta
(
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
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Penerbangan Rombongan Maskapai SV', false,
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80',
  '["Tiket Direct Saudia Airlines", "Bagasi 2 x 23 kg", "Free Air Zamzam 5 Liter", "Name List Update H-14 Keberangkatan", "PNR Terverifikasi Garansi BSI Escrow"]'
),

-- Produk 4: Tiket Group Garuda Indonesia Surabaya
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
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Penerbangan Direct Juanda Surabaya', false,
  'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1000&q=80',
  '["Penerbangan Langsung dari Bandara Juanda", "Bagasi 30kg + 7kg Kabin", "Termasuk Airport Tax & Surcharge", "Garansi Seat Rombongan Utuh"]'
),

-- Produk 5: Paket LA VIP Ring 1 + Kereta Cepat
(
  '55555555-5555-5555-5555-555555555555',
  'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
  'PAKET_LA',
  'Paket Land Arrangement (LA) VIP Ring 1 + Kereta Cepat Haramain',
  'CUSTOM_LA',
  'Jeddah / Madinah',
  CURRENT_DATE + INTERVAL '20 days',
  9, 120, 48, 15,
  11200000,
  NULL, NULL, NULL,
  'Mövenpick Hotel & Residences Hajar Tower Makkah', 5, 50,
  'Anwar Al Madinah Mövenpick', 5, 60,
  'Bus Mercedes Travego VIP 2024 & Haramain Speed Train', true,
  'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1000&q=80',
  '["Visa Umrah & Asuransi KSA", "Hotel Ring 1 Masjidil Haram (50m)", "Hotel Ring 1 Masjid Nabawi (60m)", "Tiket Kereta Cepat Haramain", "Muthawwif S2 Madinah", "Katering 3x Sehari Nusantara"]'
),

-- Produk 6: Paket LA Reguler Hemat Rombongan
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
  NULL, NULL, NULL,
  'Le Méridien Towers Makkah (Shuttle 24 Jam)', 4, 300,
  'Rove Al Madinah', 4, 200,
  'Bus Eksekutif Yutong AC 2023', false,
  'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1000&q=80',
  '["Visa Umrah Muassasah Resmi", "Hotel Bintang 4 Nyaman", "Bus AC Dingin Transfer Bandara - Makkah - Madinah", "Muthawwif Bahasa Indonesia", "Makan 3x Sehari Menu Indonesia"]'
),

-- Produk 7: Paket Umroh Spesial Tokoh & Purna Tugas
(
  '77777777-7777-7777-7777-777777777777',
  'c3d4e5f6-a1b2-4c3d-ae4f-5a6b7c8d9e0f',
  'PAKET_UMROH',
  'Umroh Spesial Purna Tugas & Penghargaan ASN KORPRI 10 Hari',
  'SPESIAL_TOKOH',
  'Surabaya (SUB)',
  CURRENT_DATE + INTERVAL '40 days',
  10, 50, 19, 1,
  31500000,
  'Saudia Airlines',
  'SUB - JED / MED - SUB (Direct)',
  'SV10SUB',
  'Hilton Convention Makkah', 5, 150,
  'Al Rawda Royal Inn', 5, 100,
  'Bus VIP Eksekutif AC', true,
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
  '["Bimbingan Ibadah Khusus Lansia & Purna Tugas", "Pendampingan Dokter & Paramedis Korpri", "Hotel Ring 1 Tanpa Menyeberang Jalan", "Penerbangan Langsung Tanpa Transit"]'
),

-- Produk 8: Tiket Group Lion Air Solo (SOC)
(
  '88888888-8888-8888-8888-888888888888',
  'd4e5f6a1-b2c3-4d5e-bf6a-7b8c9d0e1f2a',
  'TIKET_GROUP',
  'Tiket Group Rombongan Solo (SOC) - Madinah Direct Airbus A330',
  'EARLY_BOOKING_GROUP',
  'Solo (SOC)',
  CURRENT_DATE + INTERVAL '35 days',
  9, 50, 18, 10,
  15200000,
  'Lion Air Widebody A330',
  'SOC - MED / JED - SOC',
  'JT9SOCKRP',
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Pesawat Wide Body Airbus A330 Direct Solo', false,
  'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1000&q=80',
  '["Direct Flight Adi Soemarmo Solo ke Madinah", "Pesawat Wide Body Airbus A330", "Bagasi 25kg + Free Zamzam 5L"]'
),

-- Produk 9: Paket Umroh Plus Aqsha & Jordan 14 Hari
(
  '99999999-9999-9999-9999-999999999999',
  'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
  'PAKET_UMROH',
  'Umroh Plus Ziarah Aqsha, Petra & Jordan 14 Hari KORPRI Premium',
  'PLUS_WISATA',
  'Jakarta (CGK)',
  CURRENT_DATE + INTERVAL '75 days',
  14, 30, 11, 1,
  48500000,
  'Emirates / Royal Jordanian',
  'CGK - AMM - JED - CGK',
  'EK14AQSHA',
  'Fairmont Makkah Clock Royal Tower', 5, 20,
  'Dar Al Taqwa Madinah', 5, 30,
  'Bus VIP Eksekutif Luxury', true,
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80',
  '["Ziarah Masjid Al-Aqsa & Dome of the Rock Yerusalem", "Kunjungan Kota Bersejarah Petra Jordan & Laut Mati", "Hotel Bintang 5 Ring 1 Pelataran Masjid", "Visa Jordan, Palestine & Umrah KSA"]'
),

-- Produk 10: Paket LA Hemat Makkah Madinah 12 Hari
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'd4e5f6a1-b2c3-4d5e-bf6a-7b8c9d0e1f2a',
  'PAKET_LA',
  'Paket Land Arrangement (LA) Full Service 12 Hari Rombongan Instansi',
  'CUSTOM_LA',
  'Jeddah / Madinah',
  CURRENT_DATE + INTERVAL '40 days',
  12, 80, 29, 10,
  9800000,
  NULL, NULL, NULL,
  'Anjum Hotel Makkah', 5, 120,
  'Grand Plaza Al Madinah', 4, 180,
  'Bus Eksekutif VIP AC 2024', true,
  'https://images.unsplash.com/photo-1548625361-1858a74e5057?auto=format&fit=crop&w=1000&q=80',
  '["Visa Umrah Elektronik & Tasreeh Raudhah Nusuk", "Hotel Bintang 5 Makkah (Anjum) & Bintang 4 Madinah", "Handling Bandar Udara Jeddah & Madinah", "Katering 3x Sehari & Muthawwif Khusus S2"]'
);

-- 4. Tambah Transaksi Dummy Testing
INSERT INTO bookings (
  id, booking_code, user_id, product_id, tipe_pemesan, jumlah_pax, data_jemaah, total_harga, metode_pembayaran, bsi_va_number, status_escrow
) VALUES (
  'b1111111-1111-1111-1111-111111111111',
  'KORPRI-TEST01',
  NULL,
  '11111111-1111-1111-1111-111111111111',
  'INDIVIDU',
  2,
  '[{"nama": "Dr. H. Ahmad Fauzi, M.Si", "no_paspor": "A9812471", "nip": "198507202010011005", "jenis_kamar": "QUAD"}, {"nama": "Siti Nurhaliza, S.E.", "no_paspor": "A9812472", "nip": "", "jenis_kamar": "QUAD"}]',
  57000000,
  'BSI_PEMBIAYAAN_PAYROLL',
  '9887148293819283',
  'ESCROW_LOCKED'
) ON CONFLICT (booking_code) DO NOTHING;
