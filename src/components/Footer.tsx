import React from 'react';
import { ShieldCheck, Heart, Building2, Plane, MapPin, Phone, Mail } from 'lucide-react';
import { ProductType } from '../types';

interface FooterProps {
  onSelectTab: (tab: ProductType) => void;
  onOpenCalculator: () => void;
  onOpenIslamicAssistant: () => void;
  onOpenPpiuPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenCalculator,
  onOpenIslamicAssistant,
  onOpenPpiuPortal
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      
      {/* Top Banner Escrow Assurance */}
      <div className="bg-emerald-950/60 border-b border-emerald-900/60 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Transaksi Terproteksi 100% via BSI Escrow Account</h4>
              <p className="text-slate-300 text-xs">Dana aman di rekening penampungan resmi sampai PNR & Voucher hotel terverifikasi.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-emerald-300 font-semibold text-xs">
            <span>✓ Izin Kemenag RI</span>
            <span>✓ Garansi 100% Refund</span>
            <span>✓ BSI Payroll ASN</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Col */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕋</span>
            <span className="text-xl font-black text-white">
              TokTok<span className="text-emerald-500">-Umroh</span>
            </span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
              Korpri
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Marketplace ibadah umrah resmi terintegrasi khusus bagi Aparatur Sipil Negara (ASN) dan keluarga inti di bawah naungan Korps Pegawai Republik Indonesia (KORPRI).
          </p>
          <p className="text-[11px] text-slate-500">
            Terhubung langsung dengan Bank Syariah Indonesia (BSI) dan Penyelenggara Ibadah Umrah (PPIU) berizin Kemenag RI.
          </p>
        </div>

        {/* 3 Pilar Layanan */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">Layanan Marketplace</h4>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => onSelectTab('PAKET_UMROH')} 
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Paket Umroh (All-in)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('TIKET_GROUP')} 
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plane className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tiket Group (Early Booking Blok Seat)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('PAKET_LA')} 
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>Paket Land Arrangement (LA) Saudi</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenPpiuPortal} 
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Portal Mitra Biro Travel (PPIU)
              </button>
            </li>
          </ul>
        </div>

        {/* Fitur ASN & BSI */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">Fasilitas ASN & BSI</h4>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={onOpenCalculator} 
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Simulasi Pembiayaan Umrah Payroll BSI
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenIslamicAssistant} 
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Asisten Ibadah & Kompas Kiblat
              </button>
            </li>
            <li>
              <span className="text-slate-500">Tabungan Umrah Autodebet BSI</span>
            </li>
            <li>
              <span className="text-slate-500">Program Khusus Purna Tugas ASN</span>
            </li>
          </ul>
        </div>

        {/* Kontak & Sekretariat */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">Sekretariat KORPRI</h4>
          <p className="text-slate-400 text-xs">
            Gedung Dewan Pengurus KORPRI Nasional<br />
            Jl. Medan Merdeka Utara No. 7, Gambir, Jakarta Pusat 10110
          </p>
          <div className="space-y-1.5 text-xs">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-500" /> 021-384-5123 (Call Center ASN)
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-500" /> layanan@korpri-umroh.go.id
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 py-5 text-center text-slate-500 text-[11px]">
        <p>© 2026 TokTok-Umroh (Korpri Umroh). All rights reserved. Platform Resmi Sinergi KORPRI & Bank Syariah Indonesia.</p>
      </div>

    </footer>
  );
};
