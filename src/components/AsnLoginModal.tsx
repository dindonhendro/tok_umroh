import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Lock, Check } from 'lucide-react';
import { AsnProfile } from '../types';
import { DEMO_ASN_USER } from '../data/mockData';

interface AsnLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (asn: AsnProfile) => void;
}

export const AsnLoginModal: React.FC<AsnLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const [nip, setNip] = useState(DEMO_ASN_USER.nip);
  const [password, setPassword] = useState('••••••••');
  const [instansi, setInstansi] = useState('Kementerian Keuangan RI');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        ...DEMO_ASN_USER,
        nip: nip || DEMO_ASN_USER.nip,
        instansi: instansi || DEMO_ASN_USER.instansi
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Portal Masuk ASN KORPRI</h3>
              <p className="text-[11px] text-emerald-300">Single Sign-On (SSO) Terintegrasi BKN & KORPRI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-emerald-900 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleLogin} className="p-6 text-xs text-slate-700 space-y-4">
          
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-start gap-2 text-[11px] text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>Otentikasi khusus Aparatur Sipil Negara (PNS & PPPK) aktif untuk mengakses tarif kemitraan dan fasilitas BSI.</span>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Nomor Induk Pegawai (NIP 18 Digit):</label>
            <input
              type="text"
              required
              maxLength={18}
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Kementerian / Lembaga / Pemda:</label>
            <select
              value={instansi}
              onChange={(e) => setInstansi(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
            >
              <option value="Kementerian Keuangan RI">Kementerian Keuangan RI</option>
              <option value="Kementerian Dalam Negeri RI">Kementerian Dalam Negeri RI</option>
              <option value="Kementerian Agama RI">Kementerian Agama RI</option>
              <option value="Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi">Kemendikbudristek</option>
              <option value="Pemerintah Provinsi DKI Jakarta">Pemerintah Provinsi DKI Jakarta</option>
              <option value="Pemerintah Provinsi Jawa Timur">Pemerintah Provinsi Jawa Timur</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Kata Sandi / PIN KORPRI:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? 'Memverifikasi Data ASN...' : 'Masuk & Verifikasi Status KORPRI'}
          </button>
        </form>

      </div>
    </div>
  );
};
