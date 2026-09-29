import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Mail, Lock, Building, Check, ArrowRight } from 'lucide-react';
import { AsnProfile } from '../types';
import { DEMO_ASN_USER } from '../data/mockData';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AsnProfile) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [nip, setNip] = useState('198507202010011005');
  const [namaLengkap, setNamaLengkap] = useState('Dr. H. Ahmad Fauzi, M.Si');
  const [instansi, setInstansi] = useState('Kementerian Keuangan RI (Kemenkeu)');
  const [email, setEmail] = useState('ahmad.fauzi@kemenkeu.go.id');
  const [nomorHp, setNomorHp] = useState('0812-9876-5432');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser: AsnProfile = {
        id: `usr-${Date.now()}`,
        nip: nip || '198507202010011005',
        nama_lengkap: namaLengkap || 'Ahmad Fauzi',
        instansi: instansi || 'KORPRI Unit Kemenkeu',
        jabatan: 'Pegawai ASN / Anggota KORPRI',
        nomor_hp: nomorHp || '0812-9876-5432',
        bsi_account_number: '7148-2938-1928-301',
        role: 'ASN_MEMBER'
      };

      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header Modal */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isRegisterMode ? 'Pendaftaran Program Umroh ASN' : 'Masuk Akun KORPRI Umroh'}
              </h3>
              <p className="text-[11px] text-emerald-400">Verifikasi Terpusat NIP & Layanan BSI Escrow</p>
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
        <form onSubmit={handleSubmit} className="p-6 text-xs text-slate-700 space-y-4">
          
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-2 text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <p className="font-bold">SSO ASN KORPRI Single Sign-On</p>
              <p className="text-emerald-800">
                Gunakan NIP 18 Digit Anda untuk mengakses skema pembiayaan payroll BSI & pendaftaran program umrah keluarga.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          {isRegisterMode && (
            <div>
              <label className="font-bold text-slate-800 block mb-1">Nama Lengkap (Sesuai Paspor / KTP):</label>
              <input
                type="text"
                required
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          )}

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
            <label className="font-bold text-slate-800 block mb-1">Kementerian / Lembaga / Instansi:</label>
            <select
              value={instansi}
              onChange={(e) => setInstansi(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="Kementerian Keuangan RI (Kemenkeu)">Kementerian Keuangan RI (Kemenkeu)</option>
              <option value="Kementerian Dalam Negeri RI">Kementerian Dalam Negeri RI</option>
              <option value="Kementerian Agama RI">Kementerian Agama RI</option>
              <option value="Kemendikbudristek">Kemendikbudristek</option>
              <option value="Pemprov Jawa Timur">Pemprov Jawa Timur</option>
              <option value="Pemprov DKI Jakarta">Pemprov DKI Jakarta</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Email Kedinasan / Pribadi:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Kata Sandi:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
          >
            {isLoading ? (
              <span>Memproses Otentikasi...</span>
            ) : (
              <>
                <span>{isRegisterMode ? 'Daftar Akun KORPRI Baru' : 'Masuk & Ikut Program Umroh'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              {isRegisterMode
                ? 'Sudah punya akun? Masuk di sini'
                : 'Belum terdaftar? Klik di sini untuk membuat akun baru'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
