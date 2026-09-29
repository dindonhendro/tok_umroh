import React from 'react';
import { ProductItem, SearchFilterState, ProductType } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Building2, 
  Plane, 
  MapPin, 
  Filter, 
  SlidersHorizontal, 
  Search, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

interface ProductGridProps {
  products: ProductItem[];
  filters: SearchFilterState;
  onFilterChange: (newFilters: Partial<SearchFilterState>) => void;
  onSelectProduct: (product: ProductItem) => void;
  isLoading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  filters,
  onFilterChange,
  onSelectProduct,
  isLoading
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Section Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Katalog Resmi KORPRI Umroh 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {filters.activeTab === 'TIKET_GROUP' ? (
              <>Bursa Tiket Group <span className="text-emerald-700 font-bold">(Blok Seat Maskapai)</span></>
            ) : filters.activeTab === 'PAKET_LA' ? (
              <>Paket Land Arrangement <span className="text-emerald-700 font-bold">(Layanan Darat Saudi)</span></>
            ) : (
              <>Katalog Paket Umroh <span className="text-emerald-700 font-bold">(All-in Terverifikasi)</span></>
            )}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {filters.activeTab === 'TIKET_GROUP'
              ? 'Pemesanan blok kursi pesawat rombongan untuk Korpri Unit & instansi dinas dengan kepastian PNR.'
              : filters.activeTab === 'PAKET_LA'
              ? 'Layanan darat Arab Saudi (hotel ring 1, bus VIP, muthawwif berizin, katering Nusantara) untuk rombongan dinas.'
              : 'Paket ibadah umrah komprehensif bagi ASN dan keluarga inti dengan proteksi BSI Escrow Account.'}
          </p>
        </div>

        {/* Quick Search & Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari travel, hotel, rute..."
              value={filters.searchKeyword}
              onChange={(e) => onFilterChange({ searchKeyword: e.target.value })}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 w-52 sm:w-64"
            />
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
            {products.length} Paket Ditemukan
          </span>
        </div>
      </div>

      {/* Quick Pills Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mr-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" /> Filter:
        </span>

        {/* Filter Kota */}
        <select
          value={filters.kotaKeberangkatan}
          onChange={(e) => onFilterChange({ kotaKeberangkatan: e.target.value })}
          className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="Semua Lokasi">Semua Kota</option>
          <option value="Jakarta (CGK)">Jakarta (CGK)</option>
          <option value="Surabaya (SUB)">Surabaya (SUB)</option>
          <option value="Solo (SOC)">Solo (SOC)</option>
        </select>

        {/* Filter Maskapai */}
        <select
          value={filters.maskapai}
          onChange={(e) => onFilterChange({ maskapai: e.target.value })}
          className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="Semua Maskapai">Semua Maskapai</option>
          <option value="Garuda Indonesia">Garuda Indonesia</option>
          <option value="Saudia Airlines">Saudia Airlines</option>
          <option value="Turkish Airlines">Turkish Airlines</option>
          <option value="Lion Air">Lion Air Widebody</option>
        </select>

        {/* Filter Bintang Hotel */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => onFilterChange({ bintangHotel: null })}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
              filters.bintangHotel === null ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Semua Hotel
          </button>
          <button
            onClick={() => onFilterChange({ bintangHotel: 5 })}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
              filters.bintangHotel === 5 ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            ★★★★★ Bintang 5
          </button>
          <button
            onClick={() => onFilterChange({ bintangHotel: 4 })}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
              filters.bintangHotel === 4 ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            ★★★★ Bintang 4
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Memuat paket dari Supabase...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Tidak Ada Paket Yang Sesuai</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Kriteria pencarian Anda tidak menemukan hasil. Coba reset filter atau pilih kategori pilar lainnya.
          </p>
          <button
            onClick={() => onFilterChange({
              kotaKeberangkatan: 'Semua Lokasi',
              waktuKeberangkatan: 'Semua Waktu',
              rentangHarga: 'Semua Harga',
              maskapai: 'Semua Maskapai',
              bintangHotel: null,
              searchKeyword: ''
            })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

    </section>
  );
};
