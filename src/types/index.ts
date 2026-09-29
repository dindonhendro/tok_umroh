export type ProductType = 'PAKET_UMROH' | 'TIKET_GROUP' | 'PAKET_LA';

export type PackageCategory = 
  | 'REGULER' 
  | 'PLUS_WISATA' 
  | 'SPESIAL_TOKOH' 
  | 'VIP_EXECUTIVE' 
  | 'EARLY_BOOKING_GROUP' 
  | 'CUSTOM_LA';

export type EscrowStatus = 
  | 'PENDING_PAYMENT'
  | 'ESCROW_LOCKED'
  | 'PNR_VERIFIED_RELEASED'
  | 'LA_CONFIRMED_RELEASED'
  | 'COMPLETED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED_100%';

export type PaymentMethod = 
  | 'BSI_CASH_VA'
  | 'BSI_PEMBIAYAAN_PAYROLL'
  | 'BSI_TABUNGAN_AUTODEBET';

export interface PpiuAgency {
  id: string;
  nama_travel: string;
  nomor_izin_kemenag: string;
  akreditasi: string;
  alamat?: string;
  kontak_darurat?: string;
  status_verifikasi: boolean;
  rating: number;
  logo_url?: string;
}

export interface ProductItem {
  id: string;
  agency_id: string;
  agency?: PpiuAgency;
  tipe_produk: ProductType;
  nama_produk: string;
  kategori_paket: PackageCategory;
  
  // Trip details & quota
  kota_keberangkatan: string;
  tanggal_keberangkatan: string;
  durasi_hari: number;
  total_kuota_seat: number;
  sisa_seat: number;
  min_pax_order: number;
  
  // Pricing
  harga_per_pax: number;
  mata_uang: string;
  
  // Flight info
  nama_maskapai?: string;
  rute_penerbangan?: string;
  kode_pnr_group?: string;
  
  // Hotel & LA info
  hotel_makkah?: string;
  bintang_hotel_makkah?: number;
  jarak_makkah_meter?: number;
  hotel_madinah?: string;
  bintang_hotel_madinah?: number;
  jarak_madinah_meter?: number;
  jenis_transportasi?: string;
  include_kereta_cepat?: boolean;
  image_url?: string;
  
  // Inclusions / Exclusions
  fasilitas_termasuk?: string[];
  fasilitas_tidak_termasuk?: string[];
  itinerary_detail?: Array<{ hari: number; judul: string; deskripsi: string }>;
  status_aktif?: boolean;
}

export interface AsnProfile {
  id: string;
  nip: string;
  nama_lengkap: string;
  instansi: string;
  jabatan?: string;
  nomor_hp: string;
  bsi_account_number?: string;
  role: 'ASN_MEMBER' | 'KOORDINATOR_INSTANSI' | 'ADMIN_KORPRI' | 'SUPERADMIN';
}

export interface BookingData {
  id: string;
  booking_code: string;
  user_id?: string;
  product_id: string;
  product?: ProductItem;
  tipe_pemesan: 'INDIVIDU' | 'KELUARGA' | 'ROMBONGAN_INSTANSI';
  jumlah_pax: number;
  data_jemaah: Array<{
    nama: string;
    no_paspor: string;
    nip?: string;
    jenis_kamar: 'QUAD' | 'TRIPLE' | 'DOUBLE';
  }>;
  total_harga: number;
  metode_pembayaran: PaymentMethod;
  bsi_va_number: string;
  tenor_cicilan_bulan?: number;
  angsuran_per_bulan?: number;
  status_escrow: EscrowStatus;
  created_at: string;
}

export interface SearchFilterState {
  activeTab: ProductType;
  kotaKeberangkatan: string;
  waktuKeberangkatan: string;
  rentangHarga: string;
  maskapai: string;
  bintangHotel: number | null;
  searchKeyword: string;
}
