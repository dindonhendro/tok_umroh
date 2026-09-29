import React, { useState } from 'react';
import { X, BookOpen, Clock, Compass, HeartHandshake, CheckCircle2, Volume2 } from 'lucide-react';

interface IslamicAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IslamicAssistanceModal: React.FC<IslamicAssistanceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'JADWAL' | 'KIBLAT' | 'DOA' | 'QURAN'>('JADWAL');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Asisten Ibadah Digital ASN</h3>
              <p className="text-[11px] text-slate-400">Jadwal Sholat, Arah Kiblat, & Panduan Manasik Terpadu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('JADWAL')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'JADWAL' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Jadwal Sholat
          </button>
          <button
            onClick={() => setActiveTab('KIBLAT')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'KIBLAT' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Arah Kiblat
          </button>
          <button
            onClick={() => setActiveTab('DOA')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'DOA' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Doa & Manasik
          </button>
          <button
            onClick={() => setActiveTab('QURAN')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'QURAN' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Al-Qur'an
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 text-xs text-slate-700 max-h-[60vh] overflow-y-auto">
          
          {/* TAB: JADWAL SHOLAT */}
          {activeTab === 'JADWAL' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 font-semibold block">Waktu Makkah Al-Mukarramah (KSA)</span>
                  <p className="text-xl font-black text-emerald-950">14:35:12 AST</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-800 font-semibold block">Waktu Indonesia Barat (WIB)</span>
                  <p className="text-xl font-black text-emerald-950">18:35:12 WIB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { nama: 'Subuh', wib: '04:35 WIB', ksa: '05:04 KSA' },
                  { nama: 'Dzuhur', wib: '11:58 WIB', ksa: '12:22 KSA' },
                  { nama: 'Ashar', wib: '15:10 WIB', ksa: '15:45 KSA' },
                  { nama: 'Maghrib', wib: '18:02 WIB', ksa: '18:14 KSA' },
                  { nama: 'Isya', wib: '19:11 WIB', ksa: '19:44 KSA' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                    <p className="font-bold text-slate-800 text-sm">{item.nama}</p>
                    <span className="text-emerald-700 font-extrabold block text-xs mt-1">{item.wib}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.ksa}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ARAH KIBLAT */}
          {activeTab === 'KIBLAT' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-36 h-36 mx-auto rounded-full border-4 border-emerald-600/30 flex items-center justify-center relative bg-emerald-50 shadow-inner">
                <Compass className="w-20 h-20 text-emerald-700 animate-spin-slow" />
                <span className="absolute top-2 font-bold text-xs text-red-600">N (295° NW)</span>
                <span className="absolute text-[10px] font-black text-emerald-900 bg-white/90 px-2 py-0.5 rounded shadow">
                  🕋 KA'BAH
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Arah Kiblat dari Lokasi Anda: 295.2° Barat Laut</p>
                <p className="text-slate-500 text-[11px] mt-1">Jarak ke Ka'bah: ±7.920 km dari Jakarta, Indonesia.</p>
              </div>
            </div>
          )}

          {/* TAB: DOA & MANASIK */}
          {activeTab === 'DOA' && (
            <div className="space-y-4">
              {[
                {
                  tahap: '1. Niat Umrah di Miqat',
                  arab: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً',
                  latin: 'Labbaikallahumma \'umratan',
                  arti: 'Aku penuhi panggilan-Mu ya Allah untuk menunaikan umrah.'
                },
                {
                  tahap: '2. Bacaan Talbiyah',
                  arab: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيْكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لاَ شَرِيْكَ لَكَ',
                  latin: 'Labbaikallahumma labbaik, labbaika laa syariika laka labbaik. Innal hamda wan ni\'mata laka wal mulk, laa syariika lak.',
                  arti: 'Aku datang memenuhi panggilan-Mu ya Allah, tiada sekutu bagi-Mu. Sesungguhnya segala puji, nikmat, dan kerajaan adalah milik-Mu.'
                },
                {
                  tahap: '3. Doa Antara Rukun Yamani dan Hajar Aswad',
                  arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
                  latin: 'Rabbana aatina fid-dunya hasanah wa fil aakhirati hasanah wa qinaa \'adzaban-naar.',
                  arti: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari siksa neraka.'
                }
              ].map((doa, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {doa.tahap}
                  </span>
                  <p className="text-right text-base font-bold text-slate-900 leading-loose arabic-font pt-1">
                    {doa.arab}
                  </p>
                  <p className="text-slate-700 italic font-medium">{doa.latin}</p>
                  <p className="text-slate-500 text-[11px]">{doa.arti}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB: AL-QUR'AN */}
          {activeTab === 'QURAN' && (
            <div className="space-y-4">
              <div className="bg-emerald-950 text-white p-4 rounded-2xl text-center">
                <h4 className="text-base font-bold text-emerald-200">Surah Al-Baqarah: Ayat 196</h4>
                <p className="text-xs text-slate-300 mt-1">Perintah Menyempurnakan Haji & Umrah Karena Allah</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-right text-lg font-bold text-slate-900 leading-loose arabic-font">
                  وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ ۚ
                </p>
                <p className="text-slate-700 italic font-medium">"Wa atimmul-hajja wal-'umrata lillah..."</p>
                <p className="text-slate-500 text-[11px]">"Dan sempurnakanlah ibadah haji dan umrah karena Allah..."</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
