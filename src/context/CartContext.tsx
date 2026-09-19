import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ICart, IProduct } from '../types';
import { api } from '../utils/api';
import { useToast } from './ToastContext';

export interface IFlyingItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
}

interface CartContextType {
  cart: ICart;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: IProduct, quantity?: number, event?: React.MouseEvent) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  flyingItem: IFlyingItem | null;
  clearFlyingItem: () => void;
  isCartShaking: boolean;
  refreshCart: () => Promise<void>;
}

const defaultCart: ICart = {
  _id: 'default_cart',
  userId: 'guest',
  items: [],
  subtotal: 0,
  discount: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ICart>(defaultCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [flyingItem, setFlyingItem] = useState<IFlyingItem | null>(null);
  const [isCartShaking, setIsCartShaking] = useState(false);
  const { addToast } = useToast();

  const refreshCart = useCallback(async () => {
    try {
      const res = await api.getCart();
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch {
      // Offline / fallback
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const clearFlyingItem = () => {
    setFlyingItem(null);
  };

  const addToCart = async (product: IProduct, quantity = 1, event?: React.MouseEvent) => {
    // 1. Calculate trajectory for 3D item fly to cart
    if (event) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      setFlyingItem({
        id: `fly_${Date.now()}`,
        image: product.image,
        startX,
        startY
      });

      // Trigger cart shake after flight completes (approx 750ms)
      setTimeout(() => {
        setIsCartShaking(true);
        setTimeout(() => setIsCartShaking(false), 500);
      }, 700);
    } else {
      setIsCartShaking(true);
      setTimeout(() => setIsCartShaking(false), 500);
    }

    try {
      const res = await api.addToCart(product._id, quantity);
      if (res.success && res.cart) {
        setCart(res.cart);
        addToast({
          type: 'cart',
          title: 'Added to Cart',
          message: `${product.name} (x${quantity}) ✓`
        });
      }
    } catch {
      // Local optimistic fallback
      setCart(prev => {
        const items = [...prev.items];
        const idx = items.findIndex(i => i.productId === product._id);
        if (idx > -1) {
          items[idx].quantity += quantity;
        } else {
          items.push({ productId: product._id, product, quantity });
        }
        const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
        return {
          ...prev,
          items,
          subtotal,
          total: subtotal + (subtotal > 35 ? 0 : 3.99)
        };
      });
      addToast({
        type: 'cart',
        title: 'Added to Cart',
        message: `${product.name} ✓`
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await api.updateCartItem(productId, quantity);
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch {
      setCart(prev => {
        const items = prev.items
          .map(i => (i.productId === productId ? { ...i, quantity } : i))
          .filter(i => i.quantity > 0);
        const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
        return { ...prev, items, subtotal, total: subtotal };
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    const item = cart.items.find(i => i.productId === productId);
    try {
      const res = await api.removeCartItem(productId);
      if (res.success && res.cart) {
        setCart(res.cart);
        addToast({
          type: 'info',
          title: 'Item Removed',
          message: `${item?.product.name || 'Product'} removed from cart`
        });
      }
    } catch {
      setCart(prev => {
        const items = prev.items.filter(i => i.productId !== productId);
        const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
        return { ...prev, items, subtotal, total: subtotal };
      });
    }
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await api.applyCoupon(code);
      if (res.success && res.cart) {
        setCart(res.cart);
        addToast({
          type: 'success',
          title: 'Coupon Applied',
          message: res.message
        });
        return true;
      } else {
        addToast({
          type: 'error',
          title: 'Invalid Coupon',
          message: res.message || 'Coupon code invalid'
        });
        return false;
      }
    } catch {
      return false;
    }
  };

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        flyingItem,
        clearFlyingItem,
        isCartShaking,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
