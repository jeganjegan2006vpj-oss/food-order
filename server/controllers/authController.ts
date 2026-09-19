import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { generateToken } from '../middleware/auth.js';

export const register = (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password, // in real app hashed
      phone: phone || '',
      role: 'customer' as const,
      addresses: [],
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    const token = generateToken(newUser);

    const { password: _, ...userSafe } = newUser;
    return res.status(201).json({
      success: true,
      token,
      user: userSafe,
      message: 'Account created successfully'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
    }

    const token = generateToken(user);
    const { password: _, ...userSafe } = user;
    return res.json({
      success: true,
      token,
      user: userSafe,
      message: 'Welcome back!'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
