import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Plane, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Check, 
  UploadCloud,
  FileCheck
} from 'lucide-react';
import { ProductType, PackageCategory, ProductItem } from '../types';
import { addProductItem } from '../lib/supabase';
import { INITIAL_AGENCIES } from '../data/mockData';

interface PpiuPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (newProduct: ProductItem) => void;
}

export const PpiuPortalModal: React.FC<PpiuPortalModalProps> = ({
  isOpen,
  onClose,
  onProductAdded
}) => {
  if (!isOpen) return null;

  const [tipeProduk, setTipeProduk] = useState<ProductType>('PAKET_UMROH');
  const [namaProduk, setNamaProduk] = useState('');
  const [agencyId, setAgencyId] = useState(INITIAL_AGENCIES[0].id);
  const [kotaKeberangkatan, setKotaKeberangkatan] = useState('Jakarta (CGK)');
  const [hargaPerPax, setHargaPerPax] = useState<number>(27500000);
  const [durasiHari, setDurasiHari] = useState<number>(9);
  const [kuotaSeat, setKuotaSeat] = useState<number>(45);
  const [minPax, setMinPax] = useState<number>(1);
  const [maskapai, setMaskapai] = useState('Garuda Indonesia (Direct)');
  const [pnrGroup, setPnrGroup] = useState('GA9KORPRI');
  const [hotelMakkah, setHotelMakkah] = useState('Swissôtel Al Maqam Makkah');
  const [hotelMadinah, setHotelMadinah] = useState('Dallah Taibah Madinah');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProduk.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedAgency = INITIAL_AGENCIES.find(a => a.id === agencyId) || INITIAL_AGENCIES[0];
      const newItem = await addProductItem({
        agency_id: agencyId,
        agency: selectedAgency,
        tipe_produk: tipeProduk,
        nama_produk: namaProduk,
        kategori_paket: tipeProduk === 'TIKET_GROUP' ? 'EARLY_BOOKING_GROUP' : tipeProduk === 'PAKET_LA' ? 'CUSTOM_LA' : 'REGULER',
        kota_keberangkatan: kotaKeberangkatan,
        tanggal_keberangkatan: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        durasi_hari: durasiHari,
        total_kuota_seat: kuotaSeat,
        sisa_seat: kuotaSeat,
        min_pax_order: tipeProduk === 'TIKET_GROUP' ? Math.max(10, minPax) : minPax,
        harga_per_pax: hargaPerPax,
        mata_uang: 'IDR',
        nama_maskapai: maskapai,
        rute_penerbangan: `${kotaKeberangkatan.split(' ')[0]} - JED / MED (Direct)`,
        kode_pnr_group: pnrGroup,
        hotel_makkah: hotelMakkah,
        bintang_hotel_makkah: 5,
        jarak_makkah_meter: 80,
        hotel_madinah: hotelMadinah,
        bintang_hotel_madinah: 5,
        jarak_madinah_meter: 100,
        jenis_transportasi: 'Bus VIP Eksekutif Mercedes-Benz AC',
        include_kereta_cepat: true,
        image_url: tipeProduk === 'TIKET_GROUP' 
          ? 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'
          : tipeProduk === 'PAKET_LA'
          ? 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
        fasilitas_termasuk: [
          'Verifikasi PPIU Kemenag Resmi',
          'Proteksi Dana via BSI Escrow Account',
          'Garansi Refund 100% Klausul PNR / LA Voucher'
        ]
      });

      onProductAdded(newItem);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Portal Mitra Travel (PPIU Kemenag)</h3>
              <p className="text-[11px] text-slate-400">Unggah Paket Umroh, Tiket Group, atau Land Arrangement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 text-xs text-slate-700 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {successMessage && (
            <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl font-bold flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-700" />
              <span>Paket Berhasil Diterbitkan ke Katalog & Database Supabase!</span>
            </div>
          )}

          {/* Selector Tipe Produk (3 Pilar) */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Pilih Pilar Produk:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTipeProduk('PAKET_UMROH')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tipeProduk === 'PAKET_UMROH' ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Paket Umroh</span>
              </button>
              <button
                type="button"
                onClick={() => { setTipeProduk('TIKET_GROUP'); setMinPax(10); }}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tipeProduk === 'TIKET_GROUP' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Plane className="w-4 h-4" />
                <span>Tiket Group</span>
              </button>
              <button
                type="button"
                onClick={() => setTipeProduk('PAKET_LA')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tipeProduk === 'PAKET_LA' ? 'bg-teal-600 text-white border-teal-600 shadow' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Paket LA</span>
              </button>
            </div>
          </div>

          {/* Nama Travel */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">Biro Travel Terdaftar:</label>
            <select
              value={agencyId}
              onChange={(e) => setAgencyId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
            >
              {INITIAL_AGENCIES.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.nama_travel} ({ag.nomor_izin_kemenag}) - Akreditasi {ag.akreditasi}
                </option>
              ))}
            </select>
          </div>

          {/* Nama Produk */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">Nama Paket / Produk:</label>
            <input
              type="text"
              required
              placeholder="Contoh: Umroh Reguler Ramadhan Berkah 12 Hari Bersama KORPRI"
              value={namaProduk}
              onChange={(e) => setNamaProduk(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          {/* Grid Harga & Kuota */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Harga per Pax (Rp):</label>
              <input
                type="number"
                step="500000"
                value={hargaPerPax}
                onChange={(e) => setHargaPerPax(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Total Kuota Seat:</label>
              <input
                type="number"
                value={kuotaSeat}
                onChange={(e) => setKuotaSeat(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Min. Order Pax:</label>
              <input
                type="number"
                value={minPax}
                onChange={(e) => setMinPax(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Spesifikasi Maskapai / Hotel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Kota Keberangkatan:</label>
              <select
                value={kotaKeberangkatan}
                onChange={(e) => setKotaKeberangkatan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
              >
                <option value="Jakarta (CGK)">Jakarta (CGK)</option>
                <option value="Surabaya (SUB)">Surabaya (SUB)</option>
                <option value="Solo (SOC)">Solo (SOC)</option>
                <option value="Semua Lokasi (Layanan Saudi)">Semua Lokasi (Layanan Saudi)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Maskapai / Operator:</label>
              <input
                type="text"
                value={maskapai}
                onChange={(e) => setMaskapai(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Menerbitkan...' : 'Terbitkan Paket ke TokTok-Umroh'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
