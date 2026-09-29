import React from 'react';
import { X, UserCheck, ShieldCheck, CreditCard, Building2, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';
import { AsnProfile, BookingData } from '../types';
import { getLocalBookings } from '../lib/supabase';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  asnUser: AsnProfile | null;
  onOpenCatalog: () => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  asnUser,
  onOpenCatalog
}) => {
  if (!isOpen || !asnUser) return null;

  const bookings: BookingData[] = getLocalBookings();

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header Drawer */}
        <div className="bg-emerald-950 text-white p-6 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-emerald-300 flex items-center justify-center font-bold text-xl shadow-inner">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{asnUser.nama_lengkap}</h3>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Terverifikasi ASN
                </span>
              </div>
              <p className="text-xs text-emerald-300">NIP: {asnUser.nip} • {asnUser.instansi}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-emerald-900 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-800 space-y-6">
          
          {/* User Details Grid */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">NIP (NOMOR INDUK PEGAWAI):</span>
              <span className="font-mono font-bold text-slate-900">{asnUser.nip}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">REKENING PAYROLL BSI:</span>
              <span className="font-mono font-bold text-emerald-800">{asnUser.bsi_account_number || '7148-2938-1928-301'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">JABATAN / PERAN:</span>
              <span className="font-bold text-slate-800">{asnUser.jabatan || 'Pegawai ASN Aktif'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">STATUS KEANGGOTAAN:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Member KORPRI Resmi
              </span>
            </div>
          </div>

          {/* Bookings & Programs List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> Program Umroh & Transaksi Saya ({bookings.length})
              </h4>
              <button
                onClick={() => {
                  onClose();
                  onOpenCatalog();
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer"
              >
                + Ikut Program Umroh Baru
              </button>
            </div>

            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                      <div>
                        <span className="bg-amber-100 text-amber-950 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                          {b.booking_code}
                        </span>
                        <p className="text-xs font-bold text-slate-900 mt-1">
                          Booking Program {b.jumlah_pax} Pax ({b.tipe_pemesan})
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        b.status_escrow === 'PNR_VERIFIED_RELEASED' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {b.status_escrow}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Total Tagihan:</span>
                        <span className="font-extrabold text-slate-900">{formatRupiah(b.total_harga)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Nomor BSI VA:</span>
                        <span className="font-mono font-bold text-emerald-800">{b.bsi_va_number}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-slate-500 font-semibold mb-3">Anda belum memiliki transaksi booking umrah aktif.</p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCatalog();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-sm"
                >
                  Pilih Program Umroh Sekarang
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
