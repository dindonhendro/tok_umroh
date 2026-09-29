import React from 'react';
import { 
  Building2, 
  Plane, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Users, 
  Calendar, 
  Train, 
  Check, 
  CreditCard,
  Luggage,
  Clock
} from 'lucide-react';
import { ProductItem } from '../types';

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Estimasi cicilan syariah BSI 36 bulan (margin syariah ~7% p.a.)
  const estimasiCicilanBsi = Math.round((product.harga_per_pax * 1.21) / 36);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Image & Badges Header */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80'}
          alt={product.nama_produk}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {product.tipe_produk === 'TIKET_GROUP' ? (
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Plane className="w-3.5 h-3.5" /> Early Booking Group
            </span>
          ) : product.tipe_produk === 'PAKET_LA' ? (
            <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Land Arrangement
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Paket Umroh
            </span>
          )}

          {/* Sisa Kuota Seat */}
          <span className="bg-black/60 backdrop-blur-md text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20">
            Sisa {product.sisa_seat} seat
          </span>
        </div>

        {/* Bottom Floating Info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-200 mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {product.durasi_hari} Hari
            </span>
            <span>•</span>
            <span className="truncate">{product.kota_keberangkatan}</span>
          </div>
          <h3 className="text-base font-bold text-white leading-snug line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {product.nama_produk}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        
        {/* Info Travel & Rating */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {product.agency?.nama_travel || 'PT Korpri Mandiri Wisata'}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Berizin Kemenag RI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold text-amber-800 border border-amber-200">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.agency?.rating || 4.9}</span>
          </div>
        </div>

        {/* Key Specifications Per Product Type */}
        <div className="space-y-2 text-xs text-slate-600">
          {product.tipe_produk === 'TIKET_GROUP' ? (
            <>
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                <span className="text-slate-500 font-medium">Maskapai & Rute:</span>
                <span className="font-bold text-slate-800 text-right">{product.nama_maskapai}</span>
              </div>
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                <span className="text-slate-500 font-medium">Ketentuan Min. Order:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Min. {product.min_pax_order} Pax (Grup)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                <span className="text-slate-500 font-medium">Kode PNR Group:</span>
                <span className="font-mono font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded">
                  {product.kode_pnr_group || 'CONFIRMED'}
                </span>
              </div>
            </>
          ) : product.tipe_produk === 'PAKET_LA' ? (
            <>
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                <span className="text-slate-500 font-medium">Hotel Makkah:</span>
                <span className="font-bold text-slate-800 truncate max-w-[170px]" title={product.hotel_makkah}>
                  {product.hotel_makkah} ({product.jarak_makkah_meter}m)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                <span className="text-slate-500 font-medium">Hotel Madinah:</span>
                <span className="font-bold text-slate-800 truncate max-w-[170px]" title={product.hotel_madinah}>
                  {product.hotel_madinah} ({product.jarak_madinah_meter}m)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                <span className="text-slate-500 font-medium">Transportasi:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  {product.include_kereta_cepat && <Train className="w-3.5 h-3.5 text-emerald-600" />}
                  {product.jenis_transportasi?.slice(0, 24)}...
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                <span className="text-slate-500 font-medium">Penerbangan:</span>
                <span className="font-bold text-slate-800">{product.nama_maskapai}</span>
              </div>
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                <span className="text-slate-500 font-medium">Hotel Makkah:</span>
                <span className="font-bold text-slate-800 truncate max-w-[170px]">
                  {'★'.repeat(product.bintang_hotel_makkah || 5)} {product.hotel_makkah?.split(' ')[0]} ({product.jarak_makkah_meter}m)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                <span className="text-slate-500 font-medium">Fasilitas Khusus:</span>
                <span className="font-bold text-emerald-700">Kereta Cepat & Fullboard</span>
              </div>
            </>
          )}
        </div>

        {/* Pricing & BSI Financing Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          
          {/* BSI Financing Tag */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-900 font-medium flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-700" /> Pembiayaan BSI:
            </span>
            <span className="font-bold text-emerald-800">
              Mulai {formatRupiah(estimasiCicilanBsi)}/bln
            </span>
          </div>

          <div className="flex items-end justify-between mt-1">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Harga per {product.tipe_produk === 'TIKET_GROUP' ? 'Seat' : 'Pax'}:</span>
              <p className="text-xl font-extrabold text-slate-900">
                {formatRupiah(product.harga_per_pax)}
              </p>
            </div>
            <button
              onClick={() => onSelect(product)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{product.tipe_produk === 'TIKET_GROUP' ? 'Pesan Seat' : 'Detail Paket'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
