import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';
import { IReview } from '../models/types.js';

export const getProductReviews = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const reviews = db.reviews.filter(r => r.productId === productId);
    return res.json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || 'guest_user';
    const userName = req.body.userName || req.user?.email.split('@')[0] || 'Verified Shopper';
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and review comment are required.' });
    }

    const newReview: IReview = {
      _id: `rev_${Date.now()}`,
      userId,
      userName,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
      productId,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    db.reviews.unshift(newReview);

    // Update product rating and reviewsCount
    const product = db.products.find(p => p._id === productId);
    if (product) {
      const allProductReviews = db.reviews.filter(r => r.productId === productId);
      const avg = allProductReviews.reduce((sum, r) => sum + r.rating, 0) / allProductReviews.length;
      product.rating = Number(avg.toFixed(1));
      product.reviewsCount = allProductReviews.length;
    }

    return res.status(201).json({ success: true, review: newReview, message: 'Review submitted successfully!' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
