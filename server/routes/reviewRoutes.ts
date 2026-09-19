import { Router } from 'express';
import { getProductReviews, createReview } from '../controllers/reviewController.js';

const router = Router();

router.get('/:productId', getProductReviews);
router.post('/', createReview);

export default router;
