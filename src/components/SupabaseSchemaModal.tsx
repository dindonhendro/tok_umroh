import React, { useState } from 'react';
import { X, Database, Copy, Check, ExternalLink, ShieldCheck, Terminal } from 'lucide-react';

interface SupabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_SCHEMA_TEXT = `-- Skema Supabase TokTok-Umroh (Korpri Umroh)
-- Dijalankan di Supabase SQL Editor: https://supabase.com/dashboard/project/ohmdvvbrmxquzfqgafje/sql/new

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

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES ppiu_agencies(id) ON DELETE CASCADE,
  tipe_produk VARCHAR(30) NOT NULL CHECK (tipe_produk IN ('PAKET_UMROH', 'TIKET_GROUP', 'PAKET_LA')),
  nama_produk VARCHAR(255) NOT NULL,
  kategori_paket VARCHAR(50),
  kota_keberangkatan VARCHAR(100) NOT NULL,
  tanggal_keberangkatan DATE NOT NULL,
  durasi_hari INT NOT NULL DEFAULT 9,
  total_kuota_seat INT NOT NULL,
  sisa_seat INT NOT NULL,
  min_pax_order INT NOT NULL DEFAULT 1,
  harga_per_pax NUMERIC(14,2) NOT NULL,
  mata_uang VARCHAR(5) DEFAULT 'IDR',
  nama_maskapai VARCHAR(100),
  rute_penerbangan VARCHAR(100),
  kode_pnr_group VARCHAR(50),
  hotel_makkah VARCHAR(150),
  bintang_hotel_makkah INT CHECK (bintang_hotel_makkah BETWEEN 3 AND 5),
  jarak_makkah_meter INT,
  hotel_madinah VARCHAR(150),
  bintang_hotel_madinah INT CHECK (bintang_hotel_madinah BETWEEN 3 AND 5),
  jarak_madinah_meter INT,
  jenis_transportasi VARCHAR(100) DEFAULT 'Bus VIP Eksekutif AC',
  include_kereta_cepat BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  fasilitas_termasuk JSONB,
  fasilitas_tidak_termasuk JSONB,
  itinerary_detail JSONB,
  status_aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(30) UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  tipe_pemesan VARCHAR(30) DEFAULT 'INDIVIDU',
  jumlah_pax INT NOT NULL,
  data_jemaah JSONB NOT NULL,
  total_harga NUMERIC(14,2) NOT NULL,
  metode_pembayaran VARCHAR(50),
  bsi_va_number VARCHAR(50),
  kode_pnr_verified VARCHAR(50),
  voucher_la_verified VARCHAR(100),
  status_escrow VARCHAR(50) DEFAULT 'PENDING_PAYMENT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppiu_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read verified agencies" ON ppiu_agencies FOR SELECT USING (status_verifikasi = true);
CREATE POLICY "Public read active products" ON products FOR SELECT USING (status_aktif = true);
CREATE POLICY "Public create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
`;

export const SupabaseSchemaModal: React.FC<SupabaseSchemaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Integrasi Supabase Cloud</h3>
              <p className="text-[11px] text-slate-400">Project Ref: ohmdvvbrmxquzfqgafje (Supabase Cloud)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs text-slate-700 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1.5 text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Status Koneksi Supabase</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Aplikasi ini dikonfigurasi langsung dengan Supabase Project <code>ohmdvvbrmxquzfqgafje</code>. Skema database di bawah mencakup tabel <code>profiles</code>, <code>ppiu_agencies</code>, <code>products</code>, dan <code>bookings</code>.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-500" /> DDL SQL Schema (PRDinit.md):
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin SQL'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-56 border border-slate-800">
              {SQL_SCHEMA_TEXT}
            </pre>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-[11px] space-y-2 text-slate-600">
            <p className="font-bold text-slate-800">Langkah Menjalankan di Supabase Dashboard:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Buka Supabase SQL Editor: <a href="https://supabase.com/dashboard/project/ohmdvvbrmxquzfqgafje/sql/new" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline inline-flex items-center gap-0.5">Buka SQL Editor <ExternalLink className="w-3 h-3" /></a></li>
              <li>Klik tombol <strong>Salin SQL</strong> di atas dan tempel (paste) di editor.</li>
              <li>Klik tombol hijau <strong>Run</strong> untuk mengeksekusi DDL.</li>
              <li>Aplikasi secara otomatis membaca data tabel live dari database Supabase Anda.</li>
            </ol>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer text-xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
