import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';
import { ICategory } from '../models/types.js';

export const getAdminStats = (_req: AuthenticatedRequest, res: Response) => {
  try {
    const totalSales = db.orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalOrders = db.orders.length;
    const totalCustomers = db.users.filter(u => u.role === 'customer').length;
    const totalProducts = db.products.length;
    const pendingOrders = db.orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
    const deliveredOrders = db.orders.filter(o => o.orderStatus === 'Delivered').length;

    return res.json({
      success: true,
      stats: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        deliveredOrders
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomers = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search } = req.query;
    let customers = db.users.filter(u => u.role === 'customer');

    if (search) {
      const q = (search as string).toLowerCase();
      customers = customers.filter(
        c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }

    const customersWithOrderStats = customers.map(c => {
      const userOrders = db.orders.filter(o => o.userId === c._id);
      const spent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const { password: _, ...safeUser } = c;
      return {
        ...safeUser,
        orderCount: userOrders.length,
        totalSpent: Number(spent.toFixed(2)),
        lastOrderDate: userOrders[0]?.createdAt || null
      };
    });

    return res.json({ success: true, count: customersWithOrderStats.length, customers: customersWithOrderStats });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleBlockCustomer = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const customer = db.users.find(u => u._id === id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    customer.isBlocked = !customer.isBlocked;
    return res.json({
      success: true,
      isBlocked: customer.isBlocked,
      message: `Account ${customer.isBlocked ? 'blocked' : 'unblocked'} successfully.`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addCategory = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, icon, image, description, color } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: ICategory = {
      _id: `cat_${Date.now()}`,
      name,
      slug,
      icon: icon || '🛒',
      image: image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      description: description || 'Fresh grocery selection',
      productCount: 0,
      color: color || '#10b981'
    };

    db.categories.push(newCat);
    return res.status(201).json({ success: true, category: newCat, message: 'Category added' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const idx = db.categories.findIndex(c => c._id === id || c.slug === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    db.categories.splice(idx, 1);
    return res.json({ success: true, message: 'Category removed.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
