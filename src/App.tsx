import React, { useState, useEffect } from 'react';
import { ProductType, ProductItem, SearchFilterState, AsnProfile, BookingData } from './types';
import { fetchProducts } from './lib/supabase';
import { DEMO_ASN_USER } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BsiFinancingCalculator } from './components/BsiFinancingCalculator';
import { IslamicAssistanceModal } from './components/IslamicAssistanceModal';
import { PpiuPortalModal } from './components/PpiuPortalModal';
import { UserAuthModal } from './components/UserAuthModal';
import { UserProfileDrawer } from './components/UserProfileDrawer';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SupabaseSchemaModal } from './components/SupabaseSchemaModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Search and filter state
  const [filters, setFilters] = useState<SearchFilterState>({
    activeTab: 'PAKET_UMROH',
    kotaKeberangkatan: 'Semua Lokasi',
    waktuKeberangkatan: 'Semua Waktu',
    rentangHarga: 'Semua Harga',
    maskapai: 'Semua Maskapai',
    bintangHotel: null,
    searchKeyword: ''
  });

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isIslamicAssistantOpen, setIsIslamicAssistantOpen] = useState(false);
  const [isPpiuPortalOpen, setIsPpiuPortalOpen] = useState(false);
  const [isAsnLoginOpen, setIsAsnLoginOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  // ASN Auth state (Demo preloaded ASN User)
  const [asnUser, setAsnUser] = useState<AsnProfile | null>(DEMO_ASN_USER);

  // Load products based on filter changes
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts(filters);
      setProducts(data);
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters.activeTab, filters.kotaKeberangkatan, filters.maskapai, filters.bintangHotel]);

  const handleFilterChange = (newFilters: Partial<SearchFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = () => {
    loadProducts();
  };

  const handleSelectTab = (tab: ProductType) => {
    setFilters(prev => ({ ...prev, activeTab: tab }));
  };

  const handleProductAdded = (newProduct: ProductItem) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleBookingSuccess = (booking: BookingData) => {
    // Refresh product stock
    setProducts(prev => prev.map(p => {
      if (p.id === booking.product_id) {
        return { ...p, sisa_seat: Math.max(0, p.sisa_seat - booking.jumlah_pax) };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. Header / Navbar */}
      <Navbar
        activeTab={filters.activeTab}
        onSelectTab={handleSelectTab}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenIslamicAssistant={() => setIsIslamicAssistantOpen(true)}
        onOpenPpiuPortal={() => setIsPpiuPortalOpen(true)}
        onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        asnUser={asnUser}
        onLoginAsn={() => setIsAsnLoginOpen(true)}
        onLogoutAsn={() => setAsnUser(null)}
      />

      {/* 2. Unified Hero Section (Search Engine 3 Pilar) */}
      <HeroSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onOpenPpiuPortal={() => setIsPpiuPortalOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* 3. Product Catalog Grid */}
      <main className="flex-1" id="katalog-section">
        <ProductGrid
          products={products}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          isLoading={isLoading}
        />
      </main>

      {/* 4. Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        asnUser={asnUser}
        onClose={() => setSelectedProduct(null)}
        onSuccessBooking={handleBookingSuccess}
      />

      <BsiFinancingCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <IslamicAssistanceModal
        isOpen={isIslamicAssistantOpen}
        onClose={() => setIsIslamicAssistantOpen(false)}
      />

      <PpiuPortalModal
        isOpen={isPpiuPortalOpen}
        onClose={() => setIsPpiuPortalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      <UserAuthModal
        isOpen={isAsnLoginOpen}
        onClose={() => setIsAsnLoginOpen(false)}
        onLoginSuccess={(user) => {
          setAsnUser(user);
          setIsUserProfileOpen(true);
        }}
      />

      <UserProfileDrawer
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        asnUser={asnUser}
        onOpenCatalog={() => {
          const el = document.getElementById('katalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onProductsUpdated={loadProducts}
      />

      <SupabaseSchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />

      {/* 5. Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenIslamicAssistant={() => setIsIslamicAssistantOpen(true)}
        onOpenPpiuPortal={() => setIsPpiuPortalOpen(true)}
      />

    </div>
  );
};

export default App;
