import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';
import { IOrder } from '../models/types.js';

export const createOrder = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || 'guest_user';
    const {
      customerName,
      customerEmail,
      items,
      deliveryAddress,
      deliveryMethod,
      paymentMethod,
      subtotal,
      discount,
      deliveryFee,
      tax,
      totalAmount
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required to place an order.' });
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.street) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required.' });
    }

    const orderNumber = `FC-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();

    const newOrder: IOrder = {
      _id: `ord_${Date.now()}`,
      orderNumber,
      userId,
      customerName: customerName || deliveryAddress.fullName,
      customerEmail: customerEmail || req.user?.email || 'guest@freshcart.com',
      items,
      deliveryAddress,
      deliveryMethod: deliveryMethod || 'standard',
      deliveryFee: deliveryFee || (deliveryMethod === 'express' ? 3.99 : deliveryMethod === 'same-day' ? 4.99 : 0),
      paymentMethod: paymentMethod || 'card',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      orderStatus: 'Placed',
      timeline: [
        { status: 'Order Placed', timestamp: 'Just now', note: 'Order successfully received', completed: true },
        { status: 'Order Confirmed', timestamp: 'Pending', note: 'Awaiting warehouse confirmation', completed: false },
        { status: 'Packing', timestamp: 'Pending', note: 'Fresh produce preparation and thermal sealing', completed: false },
        { status: 'Out for Delivery', timestamp: 'Pending', note: 'Assigned to delivery courier', completed: false },
        { status: 'Delivered', timestamp: 'Pending', note: 'Safe doorstep dropoff', completed: false }
      ],
      subtotal: Number(subtotal || 0),
      discount: Number(discount || 0),
      tax: Number(tax || 0),
      totalAmount: Number(totalAmount || 0),
      estimatedDelivery: deliveryMethod === 'same-day' ? 'Today in 2 hours' : deliveryMethod === 'express' ? 'Today by 6 PM' : 'Tomorrow by 11 AM',
      createdAt: now.toISOString()
    };

    db.orders.unshift(newOrder);

    // Clear cart
    const cart = db.carts.get(userId);
    if (cart) {
      cart.items = [];
      cart.subtotal = 0;
      cart.discount = 0;
      cart.total = 0;
      cart.tax = 0;
      cart.deliveryFee = 0;
    }

    return res.status(201).json({
      success: true,
      order: newOrder,
      message: 'Order placed successfully ✓'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (role === 'admin') {
      return res.json({ success: true, count: db.orders.length, orders: db.orders });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userOrders = db.orders.filter(o => o.userId === userId);
    return res.json({ success: true, count: userOrders.length, orders: userOrders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = db.orders.find(o => o._id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({ success: true, order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = db.orders.find(o => o._id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.orderStatus = status;

    // Update timeline
    const statuses = ['Order Placed', 'Order Confirmed', 'Packing', 'Out for Delivery', 'Delivered'];
    const currentIdx = statuses.indexOf(status);

    order.timeline = statuses.map((st, idx) => ({
      status: st,
      timestamp: idx <= currentIdx ? (order.timeline[idx]?.timestamp !== 'Pending' ? order.timeline[idx]?.timestamp : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : 'Pending',
      note: idx === currentIdx && note ? note : order.timeline[idx]?.note || '',
      completed: idx <= currentIdx
    }));

    if (status === 'Delivered') {
      order.paymentStatus = 'completed';
    }

    return res.json({ success: true, order, message: `Order status updated to ${status}` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
