import { createClient } from '@supabase/supabase-js';
import { ProductItem, BookingData, SearchFilterState, PpiuAgency } from '../types';
import { INITIAL_PRODUCTS, INITIAL_AGENCIES } from '../data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ohmdvvbrmxquzfqgafje.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obWR2dmJybXhxdXpmcWdhZmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2Nzc5OTMsImV4cCI6MjEwNjI1Mzk5M30.tsGrwZl3W3xwtEbL_IoFK7me32NwlzUzOS7aeDKtjh8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOCAL_STORAGE_PRODUCTS_KEY = 'toktok_umroh_products_v1';
const LOCAL_STORAGE_BOOKINGS_KEY = 'toktok_umroh_bookings_v1';

export async function checkSupabaseConnection(): Promise<{ connected: boolean; hasTables: boolean; message: string }> {
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.products" does not exist')) {
        return { connected: true, hasTables: false, message: 'Terhubung ke Supabase Cloud (Skema tabel belum dieksekusi di SQL Editor)' };
      }
      return { connected: false, hasTables: false, message: `Koneksi Supabase: ${error.message}` };
    }
    return { connected: true, hasTables: true, message: 'Terhubung ke Supabase Cloud & Tabel Aktif' };
  } catch (err: any) {
    return { connected: false, hasTables: false, message: err?.message || 'Gagal menghubungi Supabase' };
  }
}

export function getLocalStoredProducts(): ProductItem[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading localStorage products', e);
  }
  return INITIAL_PRODUCTS;
}

export function saveLocalStoredProducts(products: ProductItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

export async function fetchProducts(filters?: SearchFilterState): Promise<ProductItem[]> {
  try {
    // Attempt querying Supabase
    const query = supabase.from('products').select(`
      *,
      agency:ppiu_agencies(*)
    `).eq('status_aktif', true);

    const { data, error } = await query;
    let list: ProductItem[] = [];

    if (!error && data && data.length > 0) {
      list = data as ProductItem[];
    } else {
      list = getLocalStoredProducts();
    }

    // Apply client-side filters if provided
    if (filters) {
      if (filters.activeTab) {
        list = list.filter(item => item.tipe_produk === filters.activeTab);
      }
      if (filters.kotaKeberangkatan && filters.kotaKeberangkatan !== 'Semua Lokasi') {
        list = list.filter(item => 
          item.kota_keberangkatan.toLowerCase().includes(filters.kotaKeberangkatan.toLowerCase()) ||
          item.kota_keberangkatan.includes('Semua Lokasi')
        );
      }
      if (filters.maskapai && filters.maskapai !== 'Semua Maskapai') {
        list = list.filter(item => 
          item.nama_maskapai?.toLowerCase().includes(filters.maskapai.toLowerCase())
        );
      }
      if (filters.bintangHotel) {
        list = list.filter(item => 
          (item.bintang_hotel_makkah && item.bintang_hotel_makkah >= filters.bintangHotel!) ||
          (item.bintang_hotel_madinah && item.bintang_hotel_madinah >= filters.bintangHotel!)
        );
      }
      if (filters.searchKeyword.trim()) {
        const kw = filters.searchKeyword.toLowerCase();
        list = list.filter(item => 
          item.nama_produk.toLowerCase().includes(kw) ||
          item.kota_keberangkatan.toLowerCase().includes(kw) ||
          (item.nama_maskapai && item.nama_maskapai.toLowerCase().includes(kw)) ||
          (item.hotel_makkah && item.hotel_makkah.toLowerCase().includes(kw)) ||
          (item.agency?.nama_travel && item.agency.nama_travel.toLowerCase().includes(kw))
        );
      }
    }

    return list;
  } catch (e) {
    console.warn('Fallback to local mock data:', e);
    let list = getLocalStoredProducts();
    if (filters?.activeTab) {
      list = list.filter(item => item.tipe_produk === filters.activeTab);
    }
    return list;
  }
}

export async function addProductItem(item: Omit<ProductItem, 'id'>): Promise<ProductItem> {
  const newId = crypto.randomUUID();
  const fullItem: ProductItem = {
    ...item,
    id: newId
  };

  try {
    const { data, error } = await supabase.from('products').insert([
      {
        id: newId,
        agency_id: item.agency_id,
        tipe_produk: item.tipe_produk,
        nama_produk: item.nama_produk,
        kategori_paket: item.kategori_paket,
        kota_keberangkatan: item.kota_keberangkatan,
        tanggal_keberangkatan: item.tanggal_keberangkatan,
        durasi_hari: item.durasi_hari,
        total_kuota_seat: item.total_kuota_seat,
        sisa_seat: item.sisa_seat,
        min_pax_order: item.min_pax_order,
        harga_per_pax: item.harga_per_pax,
        mata_uang: item.mata_uang || 'IDR',
        nama_maskapai: item.nama_maskapai,
        rute_penerbangan: item.rute_penerbangan,
        kode_pnr_group: item.kode_pnr_group,
        hotel_makkah: item.hotel_makkah,
        bintang_hotel_makkah: item.bintang_hotel_makkah,
        jarak_makkah_meter: item.jarak_makkah_meter,
        hotel_madinah: item.hotel_madinah,
        bintang_hotel_madinah: item.bintang_hotel_madinah,
        jarak_madinah_meter: item.jarak_madinah_meter,
        jenis_transportasi: item.jenis_transportasi,
        include_kereta_cepat: item.include_kereta_cepat,
        image_url: item.image_url,
        fasilitas_termasuk: item.fasilitas_termasuk,
        status_aktif: true
      }
    ]).select().single();

    if (!error && data) {
      fullItem.id = data.id;
    }
  } catch (e) {
    console.warn('Could not insert to remote Supabase, saving to local store:', e);
  }

  // Update local store as well
  const current = getLocalStoredProducts();
  const updated = [fullItem, ...current];
  saveLocalStoredProducts(updated);
  return fullItem;
}

export function getLocalBookings(): BookingData[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading bookings', e);
  }
  return [];
}

export function saveLocalBookings(bookings: BookingData[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving bookings', e);
  }
}

export async function createBookingTransaction(booking: Omit<BookingData, 'id' | 'created_at' | 'status_escrow'>): Promise<BookingData> {
  const newBooking: BookingData = {
    ...booking,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    status_escrow: 'ESCROW_LOCKED' // Simulasi dana telah ditampung di BSI Escrow Account
  };

  try {
    await supabase.from('bookings').insert([
      {
        id: newBooking.id,
        booking_code: newBooking.booking_code,
        user_id: newBooking.user_id,
        product_id: newBooking.product_id,
        tipe_pemesan: newBooking.tipe_pemesan,
        jumlah_pax: newBooking.jumlah_pax,
        data_jemaah: newBooking.data_jemaah,
        total_harga: newBooking.total_harga,
        metode_pembayaran: newBooking.metode_pembayaran,
        bsi_va_number: newBooking.bsi_va_number,
        status_escrow: newBooking.status_escrow
      }
    ]);
  } catch (e) {
    console.warn('Booking stored locally due to remote constraint:', e);
  }

  const current = getLocalBookings();
  const updated = [newBooking, ...current];
  saveLocalBookings(updated);

  return newBooking;
}
