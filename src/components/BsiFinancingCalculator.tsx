import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, CreditCard, ChevronRight, Check } from 'lucide-react';

interface BsiFinancingCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BsiFinancingCalculator: React.FC<BsiFinancingCalculatorProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [packageCost, setPackageCost] = useState<number>(30000000);
  const [downPayment, setDownPayment] = useState<number>(0); // Bisa 0 rupiah untuk ASN payroll
  const [tenorMonths, setTenorMonths] = useState<number>(36);
  const [jemaahCount, setJemaahCount] = useState<number>(1);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const totalCost = packageCost * jemaahCount;
  const principal = Math.max(0, totalCost - downPayment);
  // Margin syariah KORPRI PKS 6.5% p.a. flat
  const annualMarginRate = 0.065;
  const totalMargin = principal * (annualMarginRate * (tenorMonths / 12));
  const totalLoan = principal + totalMargin;
  const monthlyInstallment = Math.round(totalLoan / tenorMonths);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Simulasi Pembiayaan Umrah BSI</h3>
              <p className="text-[11px] text-emerald-300">Khusus Anggota KORPRI (PKS Resmi Kemenag & BSI)</p>
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
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Paket Cost Slider */}
          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1.5">
              <span>Perkiraan Biaya Paket per Pax:</span>
              <span className="text-emerald-700 text-sm">{formatRupiah(packageCost)}</span>
            </div>
            <input
              type="range"
              min="15000000"
              max="60000000"
              step="1000000"
              value={packageCost}
              onChange={(e) => setPackageCost(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Rp 15 Jt (Tiket/LA)</span>
              <span>Rp 35 Jt (Reguler)</span>
              <span>Rp 60 Jt (VIP)</span>
            </div>
          </div>

          {/* Jumlah Orang */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Jumlah Jemaah (Orang):</label>
              <select
                value={jemaahCount}
                onChange={(e) => setJemaahCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 10, 20].map((num) => (
                  <option key={num} value={num}>
                    {num} Orang {num > 1 ? '(Keluarga/Rombongan)' : '(Pribadi)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Uang Muka (DP):</label>
              <select
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value={0}>Rp 0 (DP 0% Khusus ASN)</option>
                <option value={5000000}>Rp 5.000.000</option>
                <option value={10000000}>Rp 10.000.000</option>
                <option value={15000000}>Rp 15.000.000</option>
              </select>
            </div>
          </div>

          {/* Tenor Selector */}
          <div>
            <label className="font-bold text-slate-800 block mb-2">Jangka Waktu Cicilan (Tenor):</label>
            <div className="grid grid-cols-4 gap-2">
              {[12, 24, 36, 48].map((m) => (
                <button
                  key={m}
                  onClick={() => setTenorMonths(m)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    tenorMonths === m
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m} Bulan
                </button>
              ))}
            </div>
          </div>

          {/* Hasil Kalkulasi Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-emerald-200 text-xs">Total Biaya Perjalanan:</span>
              <span className="font-bold text-white text-sm">{formatRupiah(totalCost)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-[11px] text-emerald-300 block">Estimasi Angsuran Payroll BSI:</span>
                <p className="text-2xl font-black text-amber-300">{formatRupiah(monthlyInstallment)} <span className="text-xs text-white font-normal">/ bulan</span></p>
              </div>
              <span className="bg-emerald-700/80 text-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                Tenor {tenorMonths} Bulan
              </span>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-emerald-200">
              <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Skema autodebet potong gaji terintegrasi melalui BSI Mobile / Payroll Kemenkeu SPAN.</span>
            </div>
          </div>

          {/* Persyaratan */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Syarat Pengajuan Khusus Anggota KORPRI:</p>
            <p>1. Memiliki NIP ASN aktif dan terdaftar di database KORPRI.</p>
            <p>2. Rekening payroll gaji aktif di Bank Syariah Indonesia (BSI).</p>
            <p>3. Pengajuan dapat dilakukan 100% online tanpa jaminan agunan fisik.</p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-xs"
          >
            Tutup & Lanjutkan Cari Paket
          </button>

        </div>

      </div>
    </div>
  );
};
