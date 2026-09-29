import React from 'react';
import { 
  Plane, 
  MapPin, 
  Building2, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Calendar, 
  Coins, 
  RotateCcw,
  Briefcase
} from 'lucide-react';
import { ProductType, SearchFilterState } from '../types';

interface HeroSectionProps {
  filters: SearchFilterState;
  onFilterChange: (newFilters: Partial<SearchFilterState>) => void;
  onSearch: () => void;
  onOpenPpiuPortal: () => void;
  onOpenCalculator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onOpenPpiuPortal,
  onOpenCalculator
}) => {
  return (
    <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center bg-slate-900 text-white overflow-hidden py-16 px-4">
      {/* Background Image: Panoramik Masjidil Haram & Ka'bah */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=2000&q=85')`
        }}
      >
        {/* Multilayered Gradient Overlay for readability and cinematic atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-emerald-950/65 to-slate-950/95"></div>
        <div className="absolute inset-0 bg-radial-glow opacity-80"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center">
        
        {/* KORPRI & BSI Partnership Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-emerald-900/30">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Sinergi KORPRI Pusat & Bank Syariah Indonesia (BSI)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-white font-bold">PKS Resmi 2026</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-md">
          Satu langkah lebih dekat ke <span className="italic font-serif text-emerald-300">Baitullah.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-200/90 font-normal max-w-3xl mb-7 drop-shadow leading-relaxed">
          Bandingkan 1.200+ Paket Umroh, Tiket Pesawat, dan Land Arrangement terpercaya dalam satu tempat dengan jaminan keamanan BSI Escrow Account.
        </p>

        {/* Trust Indicators (Persis referensi Umroh.com) */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-200 mb-8">
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Izin Kemenag RI</span>
          </div>
          <span className="text-white/30 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Refund 100% (BSI Escrow)</span>
          </div>
          <span className="text-white/30 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <Users className="w-4 h-4 text-teal-400" />
            <span>250rb+ Jemaah ASN Terdaftar</span>
          </div>
        </div>

        {/* Filter Navigation Tabs (Sesuai Referensi UI Screenshot) */}
        <div className="w-full flex items-center justify-center overflow-x-auto pb-2">
          <div className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-lg p-1.5 rounded-full border border-white/15 shadow-2xl">
            
            {/* Tab: Tiket Group */}
            <button
              onClick={() => onFilterChange({ activeTab: 'TIKET_GROUP' })}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                filters.activeTab === 'TIKET_GROUP'
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Plane className="w-4 h-4 text-emerald-600" />
              <span>Tiket Group</span>
              <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Early Booking
              </span>
            </button>

            {/* Tab: Paket LA */}
            <button
              onClick={() => onFilterChange({ activeTab: 'PAKET_LA' })}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                filters.activeTab === 'PAKET_LA'
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Paket LA</span>
            </button>

            {/* Tab: Paket Umroh */}
            <button
              onClick={() => onFilterChange({ activeTab: 'PAKET_UMROH' })}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                filters.activeTab === 'PAKET_UMROH'
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Paket Umroh</span>
            </button>

            {/* Extra Tab: Sistem Travel */}
            <button
              onClick={onOpenPpiuPortal}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Sistem Travel</span>
            </button>

            {/* Extra Tab: Kalkulator / Simulasi */}
            <button
              onClick={onOpenCalculator}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Simulasi BSI</span>
            </button>
          </div>
        </div>

        {/* Unified Search Engine Box */}
        <div className="w-full mt-4 bg-white rounded-2xl sm:rounded-full p-2.5 sm:p-2 shadow-2xl border border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-slate-900">
          
          {/* Kota Keberangkatan */}
          <div className="flex-1 px-4 py-2 sm:py-1 border-b sm:border-b-0 sm:border-r border-slate-200 text-left">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">
              Kota Keberangkatan
            </span>
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-slate-400 shrink-0 rotate-45" />
              <select
                value={filters.kotaKeberangkatan}
                onChange={(e) => onFilterChange({ kotaKeberangkatan: e.target.value })}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Semua Lokasi">Semua Lokasi</option>
                <option value="Jakarta (CGK)">Jakarta (CGK)</option>
                <option value="Surabaya (SUB)">Surabaya (SUB)</option>
                <option value="Solo (SOC)">Solo (SOC)</option>
                <option value="Medan (KNO)">Medan (KNO)</option>
                <option value="Makassar (UPG)">Makassar (UPG)</option>
              </select>
            </div>
          </div>

          {/* Waktu Keberangkatan */}
          <div className="flex-1 px-4 py-2 sm:py-1 border-b sm:border-b-0 sm:border-r border-slate-200 text-left">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">
              Waktu Keberangkatan
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={filters.waktuKeberangkatan}
                onChange={(e) => onFilterChange({ waktuKeberangkatan: e.target.value })}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Semua Waktu">Semua Waktu</option>
                <option value="Bulan Ini">Bulan Ini</option>
                <option value="Musim Liburan">Musim Liburan Akhir Tahun</option>
                <option value="Rajab 1448H">Rajab 1448 H</option>
                <option value="Sya'ban 1448H">Sya'ban 1448 H</option>
                <option value="Ramadhan 1448H">Ramadhan 1448 H</option>
              </select>
            </div>
          </div>

          {/* Harga / Budget */}
          <div className="flex-1 px-4 py-2 sm:py-1 text-left">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">
              Harga / Anggaran
            </span>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={filters.rentangHarga}
                onChange={(e) => onFilterChange({ rentangHarga: e.target.value })}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Semua Harga">Semua Harga</option>
                <option value="hemat">&lt; Rp 20 Juta (Tiket / LA)</option>
                <option value="standar">Rp 20 Juta - Rp 30 Juta</option>
                <option value="menengah">Rp 30 Juta - Rp 40 Juta</option>
                <option value="vip">&gt; Rp 40 Juta (VIP Bintang 5)</option>
              </select>
            </div>
          </div>

          {/* CTA Search Button */}
          <div className="p-1 sm:p-0">
            <button
              onClick={onSearch}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-7 py-3.5 rounded-xl sm:rounded-full transition-all shadow-md shadow-emerald-700/30 hover:shadow-lg cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Cari paket</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
