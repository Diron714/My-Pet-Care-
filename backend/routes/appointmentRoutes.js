import express from 'express';
import {
    getAppointments,
    bookAppointment,
    updateAppointmentStatus,
    getAvailableSlots
} from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAppointments);
router.post('/', bookAppointment);
router.put('/:id/status', updateAppointmentStatus);
router.get('/available-slots', getAvailableSlots);

export default router;
