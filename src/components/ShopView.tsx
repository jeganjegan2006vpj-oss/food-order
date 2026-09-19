import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, Check } from 'lucide-react';
import { IProduct, ICategory } from '../types';
import { ProductCard } from './ProductCard';

interface ShopViewProps {
  products: IProduct[];
  categories: ICategory[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  onQuickView: (product: IProduct) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onQuickView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'discount'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (selectedCategory && selectedCategory !== 'all') {
          if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
        }
        if (p.price > maxPrice) return false;
        if (onlyOrganic && !p.isOrganic) return false;
        if (onlyDeals && p.discount <= 0 && !p.isDeal) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discount - a.discount;
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, maxPrice, onlyOrganic, onlyDeals, sortBy]);

  const clearFilters = () => {
    onSelectCategory('all');
    setSearchQuery('');
    setMaxPrice(30);
    setOnlyOrganic(false);
    setOnlyDeals(false);
    setSortBy('featured');
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Fresh Catalog
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              {selectedCategory && selectedCategory !== 'all'
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Department`
                : 'All Fresh Groceries'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {filteredProducts.length} premium groceries
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured Fresh</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="discount">Biggest Discount %</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                  <span>Filter Groceries</span>
                </div>
                {(selectedCategory !== 'all' || onlyOrganic || onlyDeals || maxPrice < 30) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category Radio / Pills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Department / Aisle
                </label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => onSelectCategory('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      selectedCategory === 'all' || !selectedCategory
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Departments</span>
                    <span className="text-[10px] text-slate-400">{products.length}</span>
                  </button>

                  {categories.map(cat => (
                    <button
                      key={cat._id}
                      onClick={() => onSelectCategory(cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                        selectedCategory === cat.slug
                          ? 'bg-emerald-50 text-emerald-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Max Price:</span>
                  <span className="text-emerald-700 font-display">${maxPrice.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={maxPrice}
                  onChange={e => setMaxPrice(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>$2</span>
                  <span>$40+</span>
                </div>
              </div>

              {/* Checkboxes: Organic, Deals */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyOrganic}
                    onChange={e => setOnlyOrganic(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>100% Organic Certified Only</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyDeals}
                    onChange={e => setOnlyDeals(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>On Sale / Discounted Deals</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <div className="text-4xl mb-3">🥦</div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No groceries match your filters</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
                  Try adjusting the maximum price or selecting another department aisle.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
