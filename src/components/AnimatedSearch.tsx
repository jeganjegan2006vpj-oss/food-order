import React, { useState, useEffect, useRef } from 'react';
import { Search, X, History, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { IProduct, PageView } from '../types';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';

interface AnimatedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: IProduct) => void;
  onNavigate: (page: PageView) => void;
}

const exampleSearches = ['Apples', 'Organic Milk', 'Tomatoes', 'Bread', 'Rice', 'Broccoli', 'Salmon'];

export const AnimatedSearch: React.FC<AnimatedSearchProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IProduct[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('freshcart_recent_searches');
    return saved ? JSON.parse(saved) : ['Honeycrisp Apples', 'Organic Milk', 'Whole Wheat Bread'];
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.getProducts({
          search: query,
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        });
        if (res.success) {
          setResults(res.products.slice(0, 6));
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  const handleProductClick = (product: IProduct) => {
    // Save to recent
    if (!recentSearches.includes(product.name)) {
      const updated = [product.name, ...recentSearches.slice(0, 5)];
      setRecentSearches(updated);
      localStorage.setItem('freshcart_recent_searches', JSON.stringify(updated));
    }
    onSelectProduct(product);
    onClose();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('freshcart_recent_searches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <Search className={`w-5 h-5 text-emerald-600 mr-3 flex-shrink-0 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search fruits, vegetables, milk, snacks…"
            className="w-full bg-transparent text-lg font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition mr-2"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Category Pills */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-slate-100 overflow-x-auto text-xs font-medium text-slate-600 no-scrollbar">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Filter:
          </span>
          {['all', 'fruits', 'vegetables', 'dairy', 'bakery', 'snacks', 'beverages'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full capitalize transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto p-6 space-y-4">
          {query && results.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Matching Products ({results.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.map(prod => (
                  <div
                    key={prod._id}
                    onClick={() => handleProductClick(prod)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 transition cursor-pointer group"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-14 h-14 object-cover rounded-xl bg-slate-100 flex-shrink-0 group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-emerald-700">{prod.category}</div>
                      <div className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-800">
                        {prod.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-extrabold text-slate-900">${prod.price.toFixed(2)}</span>
                        {prod.originalPrice > prod.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ${prod.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">/{prod.unit}</span>
                      </div>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        addToCart(prod, 1, e);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                      title="Add to cart"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">🔍</div>
              <p className="font-bold text-slate-800">No groceries found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for apples, milk, bread, or tomatoes</p>
            </div>
          )}

          {/* Quick Suggestions & Recents when input is empty */}
          {!query && (
            <div className="space-y-5">
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Popular Right Now</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exampleSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => handleSelectRecent(term)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5"
                    >
                      <span>{term}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-slate-500" />
                      <span>Recent Searches</span>
                    </div>
                    <button onClick={clearRecent} className="text-[11px] text-slate-400 hover:text-rose-500 normal-case font-medium">
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(term => (
                      <button
                        key={term}
                        onClick={() => handleSelectRecent(term)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
