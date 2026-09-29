import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plane, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  Calculator, 
  BookOpen, 
  Database, 
  PlusCircle, 
  LogOut,
  SlidersHorizontal,
  User
} from 'lucide-react';
import { ProductType, AsnProfile } from '../types';
import { checkSupabaseConnection } from '../lib/supabase';

interface NavbarProps {
  activeTab: ProductType;
  onSelectTab: (tab: ProductType) => void;
  onOpenCalculator: () => void;
  onOpenIslamicAssistant: () => void;
  onOpenPpiuPortal: () => void;
  onOpenSchemaModal: () => void;
  onOpenAdminDashboard: () => void;
  onOpenUserProfile: () => void;
  asnUser: AsnProfile | null;
  onLoginAsn: () => void;
  onLogoutAsn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCalculator,
  onOpenIslamicAssistant,
  onOpenPpiuPortal,
  onOpenSchemaModal,
  onOpenAdminDashboard,
  onOpenUserProfile,
  asnUser,
  onLoginAsn,
  onLogoutAsn
}) => {
  const [supabaseStatus, setSupabaseStatus] = useState<{ connected: boolean; hasTables: boolean; message: string }>({
    connected: false,
    hasTables: false,
    message: 'Memeriksa Supabase...'
  });

  useEffect(() => {
    checkSupabaseConnection().then(setSupabaseStatus);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner: Sinergi KORPRI & BSI */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RESMI KORPRI
            </span>
            <span className="hidden sm:inline">Platform Umroh Khusus ASN & Keluarga • Terverifikasi Kemenag RI • BSI Escrow Account</span>
          </div>

          <div className="flex items-center gap-3 text-emerald-200 text-[11px]">
            {/* Tombol Dashboard Admin DB */}
            <button
              onClick={onOpenAdminDashboard}
              className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3 text-amber-300" />
              <span>Dashboard Admin DB</span>
            </button>

            {/* Supabase Status Indicator */}
            <button 
              onClick={onOpenSchemaModal} 
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              title={supabaseStatus.message}
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Supabase Cloud</span>
              <span className={`w-2 h-2 rounded-full ${supabaseStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('PAKET_UMROH')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <span className="text-xl font-bold tracking-tight">🕋</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  TokTok<span className="text-emerald-600 font-extrabold">-Umroh</span>
                </span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  Korpri
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Integrated ASN Marketplace & BSI Escrow
              </p>
            </div>
          </div>

          {/* Navigation Items (3 Pilar Produk PRD) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200">
            <button
              onClick={() => onSelectTab('TIKET_GROUP')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'TIKET_GROUP'
                  ? 'bg-white text-emerald-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tiket Group</span>
              <span className="bg-amber-400 text-amber-950 text-[9px] font-bold px-1 rounded-sm">Early</span>
            </button>

            <button
              onClick={() => onSelectTab('PAKET_LA')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'PAKET_LA'
                  ? 'bg-white text-emerald-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paket LA</span>
            </button>

            <button
              onClick={() => onSelectTab('PAKET_UMROH')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'PAKET_UMROH'
                  ? 'bg-white text-emerald-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paket Umroh</span>
            </button>
          </nav>

          {/* Actions & ASN Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Tools */}
            <button
              onClick={onOpenCalculator}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Simulasi BSI</span>
            </button>

            <button
              onClick={onOpenIslamicAssistant}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Panduan Ibadah</span>
            </button>

            {/* Tombol Portal PPIU */}
            <button
              onClick={onOpenPpiuPortal}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>Portal PPIU</span>
            </button>

            {/* ASN User Status / Login */}
            {asnUser ? (
              <div className="flex items-center gap-2 bg-emerald-50/90 border border-emerald-200 pl-3 pr-2 py-1.5 rounded-xl">
                <button
                  onClick={onOpenUserProfile}
                  className="text-left cursor-pointer hover:opacity-80 transition-opacity"
                  title="Lihat Profil & Riwayat Transaksi"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-emerald-950 truncate max-w-[120px] sm:max-w-[150px]">
                      {asnUser.nama_lengkap}
                    </span>
                    <span className="bg-emerald-600 text-white text-[9px] px-1 py-0.2 rounded font-bold">ASN</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate max-w-[130px]">{asnUser.instansi.split(' ')[0]}</p>
                </button>
                <button
                  onClick={onLogoutAsn}
                  title="Keluar"
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginAsn}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Masuk ASN / Daftar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
