import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Building2, 
  Plane, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Lock, 
  Search,
  RefreshCw,
  Eye,
  Sliders
} from 'lucide-react';
import { ProductItem, BookingData, PpiuAgency } from '../types';
import { fetchProducts, addProductItem, getLocalBookings, saveLocalBookings, saveLocalStoredProducts, getLocalStoredProducts } from '../lib/supabase';
import { INITIAL_AGENCIES } from '../data/mockData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsUpdated: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onProductsUpdated
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'PRODUK' | 'ESCROW' | 'PPIU'>('PRODUK');
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [bookingList, setBookingList] = useState<BookingData[]>([]);
  const [agencyList, setAgencyList] = useState<PpiuAgency[]>(INITIAL_AGENCIES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State Edit/Create Product Modal inside Admin
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form Fields
  const [namaProduk, setNamaProduk] = useState('');
  const [tipeProduk, setTipeProduk] = useState<'PAKET_UMROH' | 'TIKET_GROUP' | 'PAKET_LA'>('PAKET_UMROH');
  const [hargaPerPax, setHargaPerPax] = useState<number>(25000000);
  const [kuotaSeat, setKuotaSeat] = useState<number>(40);
  const [sisaSeat, setSisaSeat] = useState<number>(40);
  const [kota, setKota] = useState('Jakarta (CGK)');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const loadAdminData = async () => {
    const prods = await fetchProducts();
    setProductList(prods);
    const bks = getLocalBookings();
    setBookingList(bks);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini dari database?')) {
      const updated = productList.filter(p => p.id !== id);
      setProductList(updated);
      saveLocalStoredProducts(updated);
      onProductsUpdated();
    }
  };

  const handleToggleProductStatus = (id: string) => {
    const updated = productList.map(p => {
      if (p.id === id) {
        return { ...p, status_aktif: !p.status_aktif };
      }
      return p;
    });
    setProductList(updated);
    saveLocalStoredProducts(updated);
    onProductsUpdated();
  };

  const handleReleaseEscrow = (bookingId: string) => {
    const updated = bookingList.map(b => {
      if (b.id === bookingId) {
        return { ...b, status_escrow: 'PNR_VERIFIED_RELEASED' as const };
      }
      return b;
    });
    setBookingList(updated);
    saveLocalBookings(updated);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProduk.trim()) return;

    if (editingProduct) {
      const updated = productList.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            nama_produk: namaProduk,
            tipe_produk: tipeProduk,
            harga_per_pax: hargaPerPax,
            total_kuota_seat: kuotaSeat,
            sisa_seat: sisaSeat,
            kota_keberangkatan: kota
          };
        }
        return p;
      });
      setProductList(updated);
      saveLocalStoredProducts(updated);
    } else {
      const newProd: ProductItem = {
        id: crypto.randomUUID(),
        agency_id: INITIAL_AGENCIES[0].id,
        agency: INITIAL_AGENCIES[0],
        tipe_produk: tipeProduk,
        nama_produk: namaProduk,
        kategori_paket: tipeProduk === 'TIKET_GROUP' ? 'EARLY_BOOKING_GROUP' : 'REGULER',
        kota_keberangkatan: kota,
        tanggal_keberangkatan: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        durasi_hari: 9,
        total_kuota_seat: kuotaSeat,
        sisa_seat: sisaSeat,
        min_pax_order: tipeProduk === 'TIKET_GROUP' ? 10 : 1,
        harga_per_pax: hargaPerPax,
        mata_uang: 'IDR',
        nama_maskapai: 'Garuda Indonesia Direct',
        hotel_makkah: 'Swissôtel Al Maqam Makkah',
        bintang_hotel_makkah: 5,
        status_aktif: true,
        image_url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80'
      };
      const updated = [newProd, ...productList];
      setProductList(updated);
      saveLocalStoredProducts(updated);
    }

    onProductsUpdated();
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const openEditForm = (prod: ProductItem) => {
    setEditingProduct(prod);
    setNamaProduk(prod.nama_produk);
    setTipeProduk(prod.tipe_produk);
    setHargaPerPax(prod.harga_per_pax);
    setKuotaSeat(prod.total_kuota_seat);
    setSisaSeat(prod.sisa_seat);
    setKota(prod.kota_keberangkatan);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setNamaProduk('');
    setTipeProduk('PAKET_UMROH');
    setHargaPerPax(28500000);
    setKuotaSeat(45);
    setSisaSeat(45);
    setKota('Jakarta (CGK)');
    setIsFormOpen(true);
  };

  // Analytics
  const totalOmzet = bookingList.reduce((acc, b) => acc + b.total_harga, 0);
  const totalActiveEscrow = bookingList.filter(b => b.status_escrow === 'ESCROW_LOCKED').reduce((acc, b) => acc + b.total_harga, 0);

  const filteredProducts = productList.filter(p => 
    p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.kota_keberangkatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header Dashboard Admin */}
        <div className="bg-slate-950 text-white p-5 sm:px-8 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold">Dashboard Admin TokTok-Umroh</h2>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  KORPRI Central Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">Pengelolaan Database Supabase Cloud (`ohmdvvbrmxquzfqgafje`), Escrow BSI, & Katalog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Top Cards */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-white text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-semibold">TOTAL PRODUK DIBATAS:</span>
            <span className="text-lg font-black text-emerald-400">{productList.length} Paket</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-semibold">TOTAL TRANSAKSI BOOKING:</span>
            <span className="text-lg font-black text-amber-300">{bookingList.length} Booking</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-semibold">DANA ESCROW BSI TERKUNCI:</span>
            <span className="text-sm font-extrabold text-teal-300">{formatRupiah(totalActiveEscrow || 57000000)}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-semibold">BIRO TRAVEL TERVERIFIKASI:</span>
            <span className="text-lg font-black text-white">{agencyList.length} PPIU Kemenag</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 px-6">
          <button
            onClick={() => setActiveTab('PRODUK')}
            className={`py-3 px-5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'PRODUK' ? 'border-emerald-600 text-emerald-800 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Kelola Katalog Produk ({productList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ESCROW')}
            className={`py-3 px-5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'ESCROW' ? 'border-emerald-600 text-emerald-800 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verifikasi PNR & Escrow BSI ({bookingList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PPIU')}
            className={`py-3 px-5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'PPIU' ? 'border-emerald-600 text-emerald-800 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Biro Travel PPIU ({agencyList.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-800">
          
          {/* TAB 1: KELOLA PRODUK */}
          {activeTab === 'PRODUK' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari produk di database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>

                <button
                  onClick={openCreateForm}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Paket / Produk Baru</span>
                </button>
              </div>

              {/* Table Products */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Produk / Paket</th>
                      <th className="p-3">Pilar</th>
                      <th className="p-3">Kota / Penerbangan</th>
                      <th className="p-3">Harga Pax</th>
                      <th className="p-3">Sisa Seat</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Aksi DB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900 max-w-[220px]">
                          <p className="line-clamp-1">{p.nama_produk}</p>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {p.id.substring(0, 8)}...</span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.tipe_produk === 'TIKET_GROUP' ? 'bg-amber-100 text-amber-900' : p.tipe_produk === 'PAKET_LA' ? 'bg-teal-100 text-teal-900' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {p.tipe_produk}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">
                          {p.kota_keberangkatan}
                        </td>
                        <td className="p-3 font-extrabold text-slate-900">
                          {formatRupiah(p.harga_per_pax)}
                        </td>
                        <td className="p-3 font-bold text-emerald-700">
                          {p.sisa_seat} / {p.total_kuota_seat}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleProductStatus(p.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                              p.status_aktif !== false ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {p.status_aktif !== false ? 'Aktif' : 'Non-Aktif'}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditForm(p)}
                              title="Edit Produk"
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              title="Hapus Produk"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFIKASI PNR & ESCROW BSI */}
          {activeTab === 'ESCROW' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-amber-950">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold mb-0.5">Mekanisme Pencairan Dana BSI Escrow Account</p>
                  <p className="text-amber-800">
                    Sistem menahan dana pembayaran jemaah. Dana HANYA boleh dicairkan ke travel agen setelah Admin KORPRI memverifikasi keabsahan PNR tiket maskapai atau voucher hotel LA.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Kode Booking</th>
                      <th className="p-3">Jumlah Pax</th>
                      <th className="p-3">Total Tagihan</th>
                      <th className="p-3">Metode BSI</th>
                      <th className="p-3">Status Escrow</th>
                      <th className="p-3 text-center">Aksi Pencairan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {bookingList.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {b.booking_code}
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          {b.jumlah_pax} Orang
                        </td>
                        <td className="p-3 font-extrabold text-slate-900">
                          {formatRupiah(b.total_harga)}
                        </td>
                        <td className="p-3 text-slate-600">
                          {b.metode_pembayaran}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status_escrow === 'PNR_VERIFIED_RELEASED' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-950'
                          }`}>
                            {b.status_escrow}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {b.status_escrow === 'ESCROW_LOCKED' ? (
                            <button
                              onClick={() => handleReleaseEscrow(b.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded-lg cursor-pointer shadow-xs"
                            >
                              Verifikasi PNR & Cairkan Dana
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-bold">✓ Dana Dicairkan ke Travel</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BIRO TRAVEL PPIU */}
          {activeTab === 'PPIU' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agencyList.map((ag) => (
                  <div key={ag.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
                    <img src={ag.logo_url} alt={ag.nama_travel} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ag.nama_travel}</h4>
                      <p className="text-xs text-emerald-700 font-semibold">{ag.nomor_izin_kemenag} • Akreditasi {ag.akreditasi}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{ag.alamat}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Create / Edit Form Drawer inside Admin */}
        {isFormOpen && (
          <div className="bg-slate-100 p-6 border-t border-slate-300">
            <h4 className="font-bold text-slate-900 text-sm mb-3">
              {editingProduct ? 'Edit Paket / Produk Database' : 'Tambah Paket / Produk Baru'}
            </h4>
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold block mb-1">Nama Produk:</label>
                <input
                  type="text"
                  required
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1">Pilar Produk:</label>
                <select
                  value={tipeProduk}
                  onChange={(e) => setTipeProduk(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="PAKET_UMROH">Paket Umroh</option>
                  <option value="TIKET_GROUP">Tiket Group</option>
                  <option value="PAKET_LA">Paket LA</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1">Harga per Pax (Rp):</label>
                <input
                  type="number"
                  value={hargaPerPax}
                  onChange={(e) => setHargaPerPax(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1">Total Kuota Seat:</label>
                <input
                  type="number"
                  value={kuotaSeat}
                  onChange={(e) => setKuotaSeat(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1">Sisa Seat:</label>
                <input
                  type="number"
                  value={sisaSeat}
                  onChange={(e) => setSisaSeat(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
