import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';
import { ICart } from '../models/types.js';

function recalculateCart(cart: ICart): ICart {
  const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  let discount = 0;
  if (cart.couponCode === 'FRESH20') {
    discount = Number((subtotal * 0.20).toFixed(2));
  } else if (cart.couponCode === 'SAVE10') {
    discount = Number((subtotal * 0.10).toFixed(2));
  }

  // Delivery is free above $35, otherwise $3.99
  const deliveryFee = (subtotal - discount >= 35 || cart.items.length === 0 || cart.couponCode === 'FREESHIP') ? 0 : 3.99;
  const tax = Number(((subtotal - discount) * 0.0825).toFixed(2));
  const total = Number(Math.max(0, subtotal - discount + deliveryFee + tax).toFixed(2));

  cart.subtotal = Number(subtotal.toFixed(2));
  cart.discount = discount;
  cart.deliveryFee = deliveryFee;
  cart.tax = tax;
  cart.total = total;
  cart.updatedAt = new Date().toISOString();
  return cart;
}

export const getCart = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.headers['x-guest-session'] as string || 'guest_user';
    let cart = db.carts.get(userId);
    if (!cart) {
      cart = {
        _id: `cart_${userId}`,
        userId,
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0,
        updatedAt: new Date().toISOString()
      };
      db.carts.set(userId, cart);
    }
    return res.json({ success: true, cart: recalculateCart(cart) });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.headers['x-guest-session'] as string || 'guest_user';
    const { productId, quantity = 1 } = req.body;

    const product = db.products.find(p => p._id === productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let cart = db.carts.get(userId);
    if (!cart) {
      cart = {
        _id: `cart_${userId}`,
        userId,
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0,
        updatedAt: new Date().toISOString()
      };
      db.carts.set(userId, cart);
    }

    const existingIndex = cart.items.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
      if (cart.items[existingIndex].quantity <= 0) {
        cart.items.splice(existingIndex, 1);
      }
    } else {
      if (quantity > 0) {
        cart.items.push({
          productId,
          product,
          quantity: Number(quantity)
        });
      }
    }

    recalculateCart(cart);
    return res.json({ success: true, cart, message: `${product.name} added to cart` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.headers['x-guest-session'] as string || 'guest_user';
    const { id: productId } = req.params;
    const { quantity } = req.body;

    const cart = db.carts.get(userId);
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const index = cart.items.findIndex(item => item.productId === productId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart.' });
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = newQty;
    }

    recalculateCart(cart);
    return res.json({ success: true, cart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCartItem = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.headers['x-guest-session'] as string || 'guest_user';
    const { id: productId } = req.params;

    const cart = db.carts.get(userId);
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    recalculateCart(cart);
    return res.json({ success: true, cart, message: 'Product removed from cart' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const applyCoupon = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.headers['x-guest-session'] as string || 'guest_user';
    const { code } = req.body;

    const cart = db.carts.get(userId);
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const upperCode = (code || '').toUpperCase().trim();
    if (['FRESH20', 'SAVE10', 'FREESHIP'].includes(upperCode)) {
      cart.couponCode = upperCode;
      recalculateCart(cart);
      return res.json({ success: true, cart, message: `Coupon ${upperCode} applied successfully!` });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid coupon code. Try FRESH20 or SAVE10' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
