import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  applyCoupon
} from '../controllers/cartController.js';

const router = Router();

router.get('/', getCart);
router.post('/', addToCart);
router.post('/coupon', applyCoupon);
router.put('/:id', updateCartItem);
router.delete('/:id', removeCartItem);

export default router;
