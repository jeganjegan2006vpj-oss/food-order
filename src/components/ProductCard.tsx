import React from 'react';
import { Star, Heart, Eye, ShoppingCart, Check } from 'lucide-react';
import { IProduct } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: IProduct;
  onQuickView: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, cart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const isFav = isWishlisted(product._id);
  const cartItem = cart.items.find(i => i.productId === product._id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, e);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 hover:border-emerald-300 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Badges & Actions */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4 flex items-center justify-center">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-extrabold tracking-wide uppercase shadow-sm">
            {product.discount}% OFF
          </span>
        )}

        {/* Organic or Deal badge */}
        {product.badge && !product.discount && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 shadow-sm hover:scale-110 active:scale-95 transition"
          title={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={e => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md flex items-center justify-center gap-1.5 shadow-lg transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>3D Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            <span className="text-[11px]">{product.unit}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-bold text-slate-700">{product.rating}</span>
            <span className="text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900 font-display">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md ${
              inCartQty > 0
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            {inCartQty > 0 ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>{inCartQty} in Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
