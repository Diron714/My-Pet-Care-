import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  addPetImage
} from '../controllers/petController.js';

const router = express.Router();

// Public routes
router.get('/', getAllPets);
router.get('/:id', getPetById);

// Protected routes (Admin/Staff only)
router.post('/', authenticate, requireRole(['admin', 'staff']), createPet);
router.put('/:id', authenticate, requireRole(['admin', 'staff']), updatePet);
router.delete('/:id', authenticate, requireRole(['admin', 'staff']), deletePet);
router.post('/:id/images', authenticate, requireRole(['admin', 'staff']), addPetImage);

export default router;

