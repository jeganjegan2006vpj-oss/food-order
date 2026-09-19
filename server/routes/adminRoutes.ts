import { Router } from 'express';
import {
  getAdminStats,
  getCustomers,
  toggleBlockCustomer,
  addCategory,
  deleteCategory
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/stats', requireAdmin, getAdminStats);
router.get('/customers', requireAdmin, getCustomers);
router.put('/customers/:id/block', requireAdmin, toggleBlockCustomer);
router.post('/categories', requireAdmin, addCategory);
router.delete('/categories/:id', requireAdmin, deleteCategory);

export default router;
