import pool from '../config/database.js';

// =============================================
// APPOINTMENT MANAGEMENT
// =============================================

// Helper: Generate unique appointment number
const generateAppointmentNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `APT-${year}-${random}`;
};

// GET /api/appointments - Get appointments (with filters)
export const getAppointments = async (req, res) => {
    try {
        const { status, date, limit = 50, offset = 0 } = req.query;
        const { userId, role } = req.user;

        let query = `
      SELECT a.*, 
             u_dr.first_name as dr_first_name, u_dr.last_name as dr_last_name, d.specialization,
             u_cu.first_name as cu_first_name, u_cu.last_name as cu_last_name,
             p.name as pet_name, p.species, p.breed
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.doctor_id
      JOIN users u_dr ON d.user_id = u_dr.user_id
      JOIN customers c ON a.customer_id = c.customer_id
      JOIN users u_cu ON c.user_id = u_cu.user_id
      JOIN customer_pets p ON a.customer_pet_id = p.customer_pet_id
      WHERE 1=1
    `;
        const params = [];

        if (role === 'customer') {
            const [customers] = await pool.query('SELECT customer_id FROM customers WHERE user_id = ?', [userId]);
            query += ` AND a.customer_id = ?`;
            params.push(customers[0].customer_id);
        } else if (role === 'doctor') {
            const [doctors] = await pool.query('SELECT doctor_id FROM doctors WHERE user_id = ?', [userId]);
            query += ` AND a.doctor_id = ?`;
            params.push(doctors[0].doctor_id);
        }

        if (status) {
            query += ` AND a.status = ?`;
            params.push(status);
        }

        if (date) {
            query += ` AND a.appointment_date = ?`;
            params.push(date);
        }

        query += ` ORDER BY a.appointment_date DESC, a.appointment_time ASC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [appointments] = await pool.query(query, params);

        res.json({
            success: true,
            data: appointments
        });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
};

// POST /api/appointments - Book new appointment
export const bookAppointment = async (req, res) => {
    try {
        const { doctor_id, customer_pet_id, appointment_date, appointment_time } = req.body;
        const userId = req.user.userId;

        // Get customer_id
        const [customers] = await pool.query('SELECT customer_id FROM customers WHERE user_id = ?', [userId]);
        if (customers.length === 0) {
            return res.status(400).json({ success: false, message: 'Customer profile not found' });
        }
        const customer_id = customers[0].customer_id;

        // Check if slot is taken
        const [existing] = await pool.query(
            `SELECT appointment_id FROM appointments 
       WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status NOT IN ('rejected', 'cancelled')`,
            [doctor_id, appointment_date, appointment_time]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked'
            });
        }

        // Get consultation fee
        const [doctors] = await pool.query('SELECT consultation_fee FROM doctors WHERE doctor_id = ?', [doctor_id]);
        if (doctors.length === 0) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const appointment_number = generateAppointmentNumber();

        const [result] = await pool.query(
            `INSERT INTO appointments (appointment_number, customer_id, doctor_id, customer_pet_id, appointment_date, appointment_time, consultation_fee)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [appointment_number, customer_id, doctor_id, customer_pet_id, appointment_date, appointment_time, doctors[0].consultation_fee]
        );

        // Notification for doctor
        const [doctorUser] = await pool.query('SELECT user_id FROM doctors WHERE doctor_id = ?', [doctor_id]);
        await pool.query(
            `INSERT INTO notifications (user_id, notification_type, title, message, related_id)
       VALUES (?, 'appointment', 'New Appointment Request', ?, ?)`,
            [doctorUser[0].user_id, `You have a new appointment request (${appointment_number}) for ${appointment_date}`, result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: { appointment_id: result.insertId, appointment_number }
        });
    } catch (error) {
        console.error('Book appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error booking appointment',
            error: error.message
        });
    }
};

// PUT /api/appointments/:id/status - Update appointment status
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, doctor_notes } = req.body;
        const { userId, role } = req.user;

        const [appointments] = await pool.query('SELECT a.*, c.user_id as customer_user_id FROM appointments a JOIN customers c ON a.customer_id = c.customer_id WHERE a.appointment_id = ?', [id]);
        if (appointments.length === 0) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        const appointment = appointments[0];

        // Status permissions
        if (role === 'doctor' && !['accepted', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status for doctor' });
        }
        if (role === 'customer' && status !== 'cancelled') {
            return res.status(400).json({ success: false, message: 'Invalid status for customer' });
        }

        await pool.query(
            `UPDATE appointments SET status = ?, doctor_notes = COALESCE(?, doctor_notes), updated_at = NOW() WHERE appointment_id = ?`,
            [status, doctor_notes || null, id]
        );

        // Notification for customer
        await pool.query(
            `INSERT INTO notifications (user_id, notification_type, title, message, related_id)
       VALUES (?, 'appointment', 'Appointment Update', ?, ?)`,
            [appointment.customer_user_id, `Your appointment ${appointment.appointment_number} has been ${status}`, id]
        );

        res.json({
            success: true,
            message: `Appointment ${status} successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating appointment',
            error: error.message
        });
    }
};

// GET /api/appointments/available-slots
export const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.query;
        if (!doctorId || !date) {
            return res.status(400).json({ success: false, message: 'Doctor ID and date are required' });
        }

        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Get doctor schedule for this day
        const [schedules] = await pool.query(
            `SELECT * FROM doctor_schedules WHERE doctor_id = ? AND day_of_week = ? AND is_active = TRUE`,
            [doctorId, dayName]
        );

        if (schedules.length === 0) {
            return res.json({ success: true, data: [] });
        }

        // Get current bookings for this day
        const [bookings] = await pool.query(
            `SELECT appointment_time FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND status NOT IN ('rejected', 'cancelled')`,
            [doctorId, date]
        );

        const bookedTimes = bookings.map(b => b.appointment_time.toString().slice(0, 5));

        // Generate slots
        const slots = [];
        schedules.forEach(schedule => {
            let current = new Date(`2000-01-01T${schedule.start_time}`);
            const end = new Date(`2000-01-01T${schedule.end_time}`);

            while (current < end) {
                const timeStr = current.toTimeString().slice(0, 5);
                slots.push({
                    time: timeStr,
                    available: !bookedTimes.includes(timeStr)
                });
                current = new Date(current.getTime() + schedule.slot_duration * 60000);
            }
        });

        res.json({
            success: true,
            data: slots
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching available slots',
            error: error.message
        });
    }
};
