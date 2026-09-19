import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProduct } from '../types';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

interface WishlistContextType {
  wishlist: IProduct[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: IProduct) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (product: IProduct) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<IProduct[]>(() => {
    const saved = localStorage.getItem('freshcart_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const { addToast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    localStorage.setItem('freshcart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isWishlisted = (productId: string) => {
    return wishlist.some(p => p._id === productId);
  };

  const toggleWishlist = (product: IProduct) => {
    if (isWishlisted(product._id)) {
      setWishlist(prev => prev.filter(p => p._id !== product._id));
      addToast({
        type: 'info',
        title: 'Removed',
        message: `${product.name} removed from wishlist`
      });
    } else {
      setWishlist(prev => [...prev, product]);
      addToast({
        type: 'wishlist',
        title: 'Saved',
        message: `${product.name} added to wishlist ❤️`
      });
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(p => p._id !== productId));
  };

  const moveToCart = (product: IProduct) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
