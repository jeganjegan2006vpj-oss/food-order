import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/Navbar';
import { Hero3D } from './components/Hero3D';
import { CategorySection } from './components/CategorySection';
import { ProductCard } from './components/ProductCard';
import { DealsSection } from './components/DealsSection';
import { Supermarket3D } from './components/Supermarket3D';
import { DeliveryAnimationSection } from './components/DeliveryAnimationSection';
import { CartDrawer } from './components/CartDrawer';
import { FlyingCartItem } from './components/FlyingCartItem';
import { AnimatedSearch } from './components/AnimatedSearch';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutFlow } from './components/CheckoutFlow';
import { OrderTracking } from './components/OrderTracking';
import { AdminDashboard } from './components/AdminDashboard';
import { ShopView } from './components/ShopView';
import { WishlistView } from './components/WishlistView';
import { UserProfileView } from './components/UserProfileView';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

import { IProduct, ICategory, PageView } from './types';
import { api } from './utils/api';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    // Load initial products and categories
    api.getProducts({ limit: 40 }).then(res => {
      if (res.success && res.products) {
        setProducts(res.products);
      }
    });

    api.getCategories().then(res => {
      if (res.success && res.categories) {
        setCategories(res.categories);
      }
    });

    // Keyboard shortcut for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleSelectCategory = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrder = (orderId?: string) => {
    setTrackingOrderId(orderId);
    setCurrentPage('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (product: IProduct, qty: number) => {
    addToCart(product, qty);
    setIsCartOpen(true);
  };

  const featuredProducts = products.filter(p => p.isFeatured || p.rating >= 4.7).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* 3D Flying Cart Animation Overlay */}
      <FlyingCartItem />

      {/* Global Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            {/* 1. 3D Animated Hero Section */}
            <Hero3D
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreCategories={() => {
                const el = document.getElementById('categories-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2. 12 Grocery Categories with 3D Tilt Hover */}
            <CategorySection
              categories={categories}
              onSelectCategory={handleSelectCategory}
              onNavigate={setCurrentPage}
            />

            {/* 3. Featured Products Grid */}
            <section id="featured-products" className="py-16 sm:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hand-Picked Quality</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
                      Featured Fresh Groceries
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Our daily top-rated organic produce, pasture-raised dairy, and artisan bakery items.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentPage('shop');
                    }}
                    className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold text-sm group cursor-pointer"
                  >
                    <span>View All {products.length} Items</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map(product => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Today's Best Deals (Up to 50% OFF) with Live Countdown */}
            <DealsSection
              products={products}
              onQuickView={setQuickViewProduct}
              onExploreDeals={() => setCurrentPage('deals')}
            />

            {/* 5. 3D Supermarket Walkthrough Experience */}
            <section className="py-16 bg-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
                <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
                  Interactive Supermarket Simulation
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
                  Step Inside FreshCart 3D Supermarket
                </h2>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Supermarket3D onSelectCategory={handleSelectCategory} />
              </div>
            </section>

            {/* 6. From Store to Your Door Animated Delivery */}
            <DeliveryAnimationSection
              onTrackOrder={() => handleTrackOrder()}
              onShopNow={() => setCurrentPage('shop')}
            />
          </>
        )}

        {currentPage === 'shop' && (
          <ShopView
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onQuickView={setQuickViewProduct}
          />
        )}

        {currentPage === 'categories' && (
          <div className="py-12 bg-slate-50 min-h-screen">
            <CategorySection
              categories={categories}
              onSelectCategory={handleSelectCategory}
              onNavigate={setCurrentPage}
            />
          </div>
        )}

        {currentPage === 'deals' && (
          <div className="py-12 bg-slate-50 min-h-screen">
            <DealsSection
              products={products}
              onQuickView={setQuickViewProduct}
              onExploreDeals={() => {}}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-6">
                All Discounted Supermarket Specials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products
                  .filter(p => p.discount > 0 || p.isDeal)
                  .map(product => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'store3d' && (
          <div className="py-10 bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Supermarket3D onSelectCategory={handleSelectCategory} />
            </div>
          </div>
        )}

        {currentPage === 'tracking' && (
          <OrderTracking
            orderId={trackingOrderId}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutFlow
            onOrderComplete={(orderId) => {
              setTrackingOrderId(orderId);
              setCurrentPage('tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'wishlist' && (
          <WishlistView onNavigate={setCurrentPage} />
        )}

        {currentPage === 'profile' && (
          <UserProfileView
            onNavigate={setCurrentPage}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard />
        )}

        {currentPage === 'about' && (
          <div className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Our Story</span>
              <h1 className="text-4xl font-extrabold text-slate-900 font-display mt-2 mb-6">
                Reinventing Grocery Shopping in 3D
              </h1>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                FreshCart 3D was founded on a simple principle: fresh, organic, sustainably harvested food should be convenient, transparent, and fun to explore. By combining interactive 3D supermarket simulation with a hyperlocal cold-chain delivery network, we bring farm-fresh produce to your kitchen counter in 15 minutes.
              </p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20"
              >
                Start Exploring Groceries
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={setCurrentPage}
        onSelectCategory={handleSelectCategory}
      />

      {/* Slide-over Shopping Cart */}
      <CartDrawer onNavigate={setCurrentPage} />

      {/* Live Animated Search Modal */}
      <AnimatedSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={setQuickViewProduct}
        onNavigate={setCurrentPage}
      />

      {/* 3D Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onBuyNow={handleBuyNow}
      />

      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
