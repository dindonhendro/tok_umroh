import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Calendar, 
  Plane, 
  Building2, 
  Train, 
  Users, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { ProductItem, AsnProfile, PaymentMethod, BookingData } from '../types';
import { createBookingTransaction } from '../lib/supabase';

interface ProductDetailModalProps {
  product: ProductItem | null;
  asnUser: AsnProfile | null;
  onClose: () => void;
  onSuccessBooking: (booking: BookingData) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  asnUser,
  onClose,
  onSuccessBooking
}) => {
  if (!product) return null;

  const [step, setStep] = useState<'DETAILS' | 'CONFIG' | 'PAYMENT' | 'SUCCESS'>('DETAILS');
  const [paxCount, setPaxCount] = useState<number>(product.min_pax_order || 1);
  const [roomType, setRoomType] = useState<'QUAD' | 'TRIPLE' | 'DOUBLE'>('QUAD');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BSI_PEMBIAYAAN_PAYROLL');
  const [tenorBulan, setTenorBulan] = useState<number>(36);
  
  // Data Jemaah Form
  const [jemaahList, setJemaahList] = useState<Array<{ nama: string; no_paspor: string; nip?: string }>>([
    { 
      nama: asnUser?.nama_lengkap || '', 
      no_paspor: 'A9812471', 
      nip: asnUser?.nip || '198507202010011005' 
    }
  ]);

  const [createdBooking, setCreatedBooking] = useState<BookingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Hitung penyesuaian harga kamar: Quad (default 0), Triple (+1.5jt/pax), Double (+3.5jt/pax)
  const roomSurcharge = roomType === 'DOUBLE' ? 3500000 : roomType === 'TRIPLE' ? 1500000 : 0;
  const unitPrice = product.harga_per_pax + roomSurcharge;
  const totalPrice = unitPrice * paxCount;

  // Hitung angsuran BSI Pembiayaan (Margin Syariah 6.5% p.a.)
  const annualMargin = 0.065;
  const totalMarginMultiplier = 1 + (annualMargin * (tenorBulan / 12));
  const totalFinanced = totalPrice * totalMarginMultiplier;
  const monthlyInstallment = Math.round(totalFinanced / tenorBulan);

  // Sync jemaahList length with paxCount
  const handlePaxChange = (newCount: number) => {
    if (newCount < product.min_pax_order) return;
    if (newCount > product.sisa_seat) return;
    setPaxCount(newCount);

    const updated = [...jemaahList];
    while (updated.length < newCount) {
      updated.push({ nama: '', no_paspor: '', nip: '' });
    }
    if (updated.length > newCount) {
      updated.splice(newCount);
    }
    setJemaahList(updated);
  };

  const handleJemaahChange = (index: number, field: string, val: string) => {
    const updated = [...jemaahList];
    updated[index] = { ...updated[index], [field]: val };
    setJemaahList(updated);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const bookingCode = `KORPRI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const vaNumber = `988${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const newBooking = await createBookingTransaction({
        booking_code: bookingCode,
        user_id: asnUser?.id,
        product_id: product.id,
        tipe_pemesan: paxCount > 5 ? 'ROMBONGAN_INSTANSI' : paxCount > 1 ? 'KELUARGA' : 'INDIVIDU',
        jumlah_pax: paxCount,
        data_jemaah: jemaahList.map(j => ({ ...j, jenis_kamar: roomType })),
        total_harga: totalPrice,
        metode_pembayaran: paymentMethod,
        bsi_va_number: vaNumber,
        tenor_cicilan_bulan: paymentMethod === 'BSI_PEMBIAYAAN_PAYROLL' ? tenorBulan : undefined,
        angsuran_per_bulan: paymentMethod === 'BSI_PEMBIAYAAN_PAYROLL' ? monthlyInstallment : undefined
      });

      setCreatedBooking(newBooking);
      setStep('SUCCESS');
      onSuccessBooking(newBooking);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:px-8 sm:py-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {product.tipe_produk.replace('_', ' ')}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Kemenag RI
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold line-clamp-1">{product.nama_produk}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Step View */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 text-slate-800">
          
          {/* STEP 1: DETAILS */}
          {step === 'DETAILS' && (
            <div className="space-y-6">
              
              {/* Hero Image & Fast Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 relative rounded-2xl overflow-hidden h-64 bg-slate-100">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80'}
                    alt={product.nama_produk}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs text-emerald-300 font-bold mb-1">
                      Penyelenggara: {product.agency?.nama_travel || 'PT Korpri Mandiri Wisata'}
                    </p>
                    <p className="text-sm font-semibold">{product.agency?.nomor_izin_kemenag} • Akreditasi {product.agency?.akreditasi}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-1">Harga Mulai Dari:</span>
                    <p className="text-2xl font-extrabold text-slate-900">{formatRupiah(product.harga_per_pax)}</p>
                    <span className="text-[11px] text-slate-500 font-medium">per pax (Kamar Quad / Rombongan)</span>

                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Durasi:</span>
                        <span className="font-bold text-slate-800">{product.durasi_hari} Hari</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Keberangkatan:</span>
                        <span className="font-bold text-slate-800">{product.kota_keberangkatan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sisa Kuota:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {product.sisa_seat} Seat
                        </span>
                      </div>
                      {product.min_pax_order > 1 && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Min. Pemesanan:</span>
                          <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                            Min. {product.min_pax_order} Pax
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('CONFIG')}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Lanjut Pemesanan & Simulasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fasilitas & Spesifikasi Lengkap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                
                {/* Kolom 1: Akomodasi & Transportasi */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" /> Spesifikasi Akomodasi & Rute
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    {product.nama_maskapai && (
                      <div className="flex items-start gap-2.5">
                        <Plane className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800">{product.nama_maskapai}</p>
                          <p className="text-slate-500">{product.rute_penerbangan || 'Direct Flight Tanpa Transit'}</p>
                        </div>
                      </div>
                    )}

                    {product.hotel_makkah && (
                      <div className="flex items-start gap-2.5">
                        <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800">{product.hotel_makkah} (Bintang {product.bintang_hotel_makkah || 5})</p>
                          <p className="text-slate-500">Jarak ke Masjidil Haram: ±{product.jarak_makkah_meter} meter</p>
                        </div>
                      </div>
                    )}

                    {product.hotel_madinah && (
                      <div className="flex items-start gap-2.5">
                        <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800">{product.hotel_madinah} (Bintang {product.bintang_hotel_madinah || 5})</p>
                          <p className="text-slate-500">Jarak ke Masjid Nabawi: ±{product.jarak_madinah_meter} meter</p>
                        </div>
                      </div>
                    )}

                    {product.jenis_transportasi && (
                      <div className="flex items-start gap-2.5">
                        <Train className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800">{product.jenis_transportasi}</p>
                          {product.include_kereta_cepat && (
                            <span className="text-emerald-700 font-semibold">✓ Termasuk Kereta Cepat Haramain</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Kolom 2: Fasilitas Sudah Termasuk */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fasilitas Termasuk (All-in)
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {(product.fasilitas_termasuk || [
                      'Visa Umrah Resmi & Asuransi Jiwa Kemenag',
                      'Handling Bandara Indonesia & Arab Saudi',
                      'Makan 3x Sehari Masakan Cita Rasa Nusantara',
                      'Muthawwif Khusus & Berpengalaman Lulusan Madinah',
                      'Air Zamzam 5 Liter & Perlengkapan Koper'
                    ]).map((fasilitas, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{fasilitas}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Escrow Guarantee Callout */}
              <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <p className="font-bold mb-0.5">Jaminan 100% Proteksi Dana via BSI Escrow Account</p>
                  <p className="text-emerald-800 leading-relaxed">
                    Dana pembayaran Anda tidak langsung dikirim ke travel. Dana disimpan aman di rekening penampungan resmi Bank Syariah Indonesia dan baru dicairkan setelah kode booking PNR pesawat atau voucher akomodasi terkonfirmasi sah.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: CONFIGURATION (PAX & ASN DATA) */}
          {step === 'CONFIG' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Konfigurasi Jemaah & Kamar</h3>
                <span className="text-xs text-slate-500 font-medium">Langkah 1 dari 2</span>
              </div>

              {/* Pax Counter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-2">Jumlah Jemaah (Pax):</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePaxChange(paxCount - 1)}
                      disabled={paxCount <= (product.min_pax_order || 1)}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="text-lg font-black text-slate-900 px-4">{paxCount} Orang</span>
                    <button
                      onClick={() => handlePaxChange(paxCount + 1)}
                      disabled={paxCount >= product.sisa_seat}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  {product.min_pax_order > 1 && (
                    <p className="text-[11px] text-amber-700 mt-2 font-medium">
                      *Kategori {product.tipe_produk} mensyaratkan minimal {product.min_pax_order} pax per booking rombongan.
                    </p>
                  )}
                </div>

                {/* Room Type Selector */}
                {product.tipe_produk !== 'TIKET_GROUP' && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-700 block mb-2">Tipe Kamar Hotel:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setRoomType('QUAD')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          roomType === 'QUAD' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <p className="font-bold">Quad (4 org)</p>
                        <span className="text-[10px] opacity-80">Standar</span>
                      </button>
                      <button
                        onClick={() => setRoomType('TRIPLE')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          roomType === 'TRIPLE' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <p className="font-bold">Triple (3 org)</p>
                        <span className="text-[10px] opacity-80">+1.5jt/pax</span>
                      </button>
                      <button
                        onClick={() => setRoomType('DOUBLE')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          roomType === 'DOUBLE' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <p className="font-bold">Double (2 org)</p>
                        <span className="text-[10px] opacity-80">+3.5jt/pax</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Data Jemaah Form */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Data Jemaah & Verifikasi NIP ASN KORPRI
                </h4>
                {jemaahList.slice(0, 3).map((jemaah, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Nama Jemaah {idx + 1} (Sesuai Paspor)
                      </label>
                      <input
                        type="text"
                        value={jemaah.nama}
                        placeholder="Contoh: Ahmad Fauzi"
                        onChange={(e) => handleJemaahChange(idx, 'nama', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Nomor Paspor
                      </label>
                      <input
                        type="text"
                        value={jemaah.no_paspor}
                        placeholder="Contoh: A 9812471"
                        onChange={(e) => handleJemaahChange(idx, 'no_paspor', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        NIP ASN (Opsional untuk Keluarga)
                      </label>
                      <input
                        type="text"
                        value={jemaah.nip || ''}
                        placeholder="18 Digit NIP ASN"
                        onChange={(e) => handleJemaahChange(idx, 'nip', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation Bar */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-medium">Total Estimasi Tagihan:</span>
                  <p className="text-2xl font-black text-emerald-950">{formatRupiah(totalPrice)}</p>
                  <span className="text-[11px] text-emerald-700">Untuk {paxCount} orang jemaah</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep('DETAILS')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setStep('PAYMENT')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <span>Pilih Metode BSI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: PAYMENT & BSI ESCROW */}
          {step === 'PAYMENT' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Metode Pembayaran Syariah BSI</h3>
                <span className="text-xs text-slate-500 font-medium">Langkah 2 dari 2</span>
              </div>

              {/* 3 Payment Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Option 1: Pembiayaan Syariah ASN */}
                <div
                  onClick={() => setPaymentMethod('BSI_PEMBIAYAAN_PAYROLL')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'BSI_PEMBIAYAAN_PAYROLL'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      Pilihan Favorit ASN
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">BSI Pembiayaan ASN</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      Fasilitas pembiayaan umrah syariah berbasis payroll potong gaji bulanan via PKS Korpri.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Angsuran Ringan:</span>
                    <span className="text-sm font-extrabold text-emerald-800">
                      {formatRupiah(monthlyInstallment)} / bln
                    </span>
                  </div>
                </div>

                {/* Option 2: Cash Virtual Account */}
                <div
                  onClick={() => setPaymentMethod('BSI_CASH_VA')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'BSI_CASH_VA'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                      Bayar Lunas
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">BSI Cash Virtual Account</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      Pembayaran lunas instan melalui BSI Mobile, ATM, atau transfer antar bank ke rekening Escrow.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Total Nominal:</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Option 3: Tabungan Autodebet */}
                <div
                  onClick={() => setPaymentMethod('BSI_TABUNGAN_AUTODEBET')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'BSI_TABUNGAN_AUTODEBET'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                      Perencanaan Terjadwal
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">Tabungan Umrah BSI</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      Autodebet terjadwal langsung dari rekening BSI ASN untuk target keberangkatan mendatang.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Setoran Rutin:</span>
                    <span className="text-sm font-extrabold text-teal-800">
                      Fleksibel / Sesuai Target
                    </span>
                  </div>
                </div>

              </div>

              {/* Tenor Selector for Pembiayaan */}
              {paymentMethod === 'BSI_PEMBIAYAAN_PAYROLL' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-2">Pilih Jangka Waktu Pembiayaan (Tenor):</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[12, 24, 36].map((bulan) => (
                      <button
                        key={bulan}
                        onClick={() => setTenorBulan(bulan)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          tenorBulan === bulan ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {bulan} Bulan
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>*Margin Syariah kompetitif flat 6.5% p.a. berbasis PKS Korpri Pusat.</span>
                    <span className="font-bold text-emerald-800">DP Rp 0 (Khusus Payroll ASN)</span>
                  </div>
                </div>
              )}

              {/* Escrow Clause Box */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <p className="font-bold mb-1">Klausul Keamanan BSI Escrow Account (Jaminan Uang Kembali 100%)</p>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    Dengan melanjutkan pemesanan, dana Anda ditampung secara aman pada akun escrow BSI. Dana HANYA dapat dicairkan oleh biro travel apabila sistem telah memvalidasi keaslian Kode Booking Maskapai (PNR) dan Voucher LA resmi.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep('CONFIG')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Kembali
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-700/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Memproses Transaksi...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Konfirmasi & Amankan Tiket via Escrow</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: SUCCESS VIEW */}
          {step === 'SUCCESS' && createdBooking && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner text-3xl">
                ✓
              </div>
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Pemesanan Berhasil & Terproteksi Escrow
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Alhamdulillah, Tiket Telah Diamankan!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Transaksi Anda telah tercatat di Supabase Database dan terhubung dengan sistem penampungan dana Bank Syariah Indonesia.
                </p>
              </div>

              {/* Transaction Receipt Card */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Kode Booking:</span>
                  <span className="font-mono font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded">
                    {createdBooking.booking_code}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Paket:</span>
                  <span className="font-bold text-slate-800 text-right truncate max-w-[200px]">{product.nama_produk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jumlah Jemaah:</span>
                  <span className="font-bold text-slate-800">{createdBooking.jumlah_pax} Orang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Virtual Account BSI:</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-sm">
                    {createdBooking.bsi_va_number}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Total Tagihan:</span>
                  <span className="font-black text-slate-900 text-base">{formatRupiah(createdBooking.total_harga)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Proteksi:</span>
                  <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                    ESCROW LOCKED (BSI)
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-8 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
