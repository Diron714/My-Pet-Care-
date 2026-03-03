import express from 'express';
import {
    getCustomerPets,
    addCustomerPet,
    updateCustomerPet,
    getPetVaccinations,
    addVaccinationRecord,
    getFeedingSchedules,
    addFeedingSchedule
} from '../controllers/customerPetController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCustomerPets);
router.post('/', addCustomerPet);
router.put('/:id', updateCustomerPet);
router.get('/:id/vaccinations', getPetVaccinations);
router.post('/:id/vaccinations', addVaccinationRecord);
router.get('/:id/feeding-schedules', getFeedingSchedules);
router.post('/:id/feeding-schedules', addFeedingSchedule);

export default router;
