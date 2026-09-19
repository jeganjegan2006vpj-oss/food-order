import { Router } from 'express';
import { getProfile, updateProfile, addAddress } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.post('/address', requireAuth, addAddress);

export default router;
