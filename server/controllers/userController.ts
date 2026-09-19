import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';

export const getProfile = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = db.users.find(u => u._id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { password: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = db.users.find(u => u._id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { name, phone, addresses } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (addresses && Array.isArray(addresses)) user.addresses = addresses;

    const { password: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser, message: 'Profile updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addAddress = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = db.users.find(u => u._id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { fullName, phone, street, city, state, pincode, isDefault } = req.body;
    if (!fullName || !street || !city || !pincode) {
      return res.status(400).json({ success: false, message: 'All address fields are required.' });
    }

    const newAddress = {
      id: `addr_${Date.now()}`,
      fullName,
      phone: phone || user.phone,
      street,
      city,
      state: state || 'California',
      pincode,
      isDefault: Boolean(isDefault)
    };

    if (newAddress.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    user.addresses.push(newAddress);
    return res.json({ success: true, addresses: user.addresses, message: 'Address added successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
