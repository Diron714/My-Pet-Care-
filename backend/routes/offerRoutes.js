import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  redeemOffer
} from '../controllers/offerController.js';

const router = express.Router();

// Public routes
router.get('/', getAllOffers);
router.get('/:id', getOfferById);

// Protected routes
router.post('/:id/redeem', authenticate, requireRole(['customer']), redeemOffer);

// Admin only routes
router.post('/', authenticate, requireRole(['admin']), createOffer);
router.put('/:id', authenticate, requireRole(['admin']), updateOffer);
router.delete('/:id', authenticate, requireRole(['admin']), deleteOffer);

export default router;

