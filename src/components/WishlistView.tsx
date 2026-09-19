import React from 'react';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { PageView } from '../types';

interface WishlistViewProps {
  onNavigate: (page: PageView) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ onNavigate }) => {
  const { wishlist, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Saved Favorites</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-display">
              Your Saved Groceries ({wishlist.length})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-slate-400 hover:text-rose-600 transition font-medium"
            >
              Clear all items
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-4xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-3xl mx-auto mb-4">
              ❤️
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
            <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">
              Save items you love to quickly reorder your weekly organic staples, snacks, and milk.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
            >
              Explore Fresh Catalog
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 divide-y divide-slate-100">
            {wishlist.map(product => (
              <div key={product._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {product.name}
                    </h3>
                    <div className="text-xs text-slate-400">
                      ${product.price.toFixed(2)} / {product.unit}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:ml-auto">
                  <button
                    onClick={() => moveToCart(product)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
