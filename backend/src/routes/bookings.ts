import { Router, Response } from 'express';
import pool from '../config/database';
import { formatResponse, parseRowData, calculateNights, generateBookingId } from '../utils/helpers';
import { Booking } from '../types';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/bookings/create - Create new booking (requires auth)
router.post('/create', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const {
      room_id,
      full_name,
      email,
      phone,
      check_in_date,
      check_in_time = '14:00:00',
      check_out_date,
      check_out_time = '11:00:00',
      num_adults = 1,
      num_minors = 0,
      minor_ages = [],
      payment_method = 'pay_at_property',
      upi_app,
    } = req.body;

    // Validate required fields
    if (!room_id || !full_name || !email || !phone || !check_in_date || !check_out_date) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Missing required fields')
      );
    }

    // Validate dates
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Check-in date cannot be in the past')
      );
    }

    if (checkOut <= checkIn) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Check-out date must be after check-in date')
      );
    }

    // Check if room exists and is available
    const [roomRows] = await pool.execute(
      'SELECT room_id, final_price, is_available, is_enabled FROM rooms WHERE room_id = ?',
      [room_id]
    );

    if (!Array.isArray(roomRows) || roomRows.length === 0) {
      return res.status(404).json(formatResponse(false, undefined, undefined, 'Room not found'));
    }

    const room = roomRows[0] as any;
    if (!room.is_enabled) {
      return res.status(400).json(formatResponse(false, undefined, undefined, 'Room is not available'));
    }

    // Check for booking conflicts
    const [conflicts] = await pool.execute(
      `SELECT booking_id FROM bookings 
       WHERE room_id = ? 
       AND booking_status IN ('pending', 'confirmed')
       AND (
         (check_in_date <= ? AND check_out_date > ?) OR
         (check_in_date < ? AND check_out_date >= ?) OR
         (check_in_date >= ? AND check_out_date <= ?)
       )`,
      [room_id, check_in_date, check_in_date, check_out_date, check_out_date, check_in_date, check_out_date]
    );

    if (Array.isArray(conflicts) && conflicts.length > 0) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Room is not available for the selected dates')
      );
    }

    // Calculate pricing
    const totalNights = calculateNights(check_in_date, check_out_date);
    const pricePerNight = parseFloat(room.final_price);
    const totalAmount = pricePerNight * totalNights;

    // Generate booking ID
    const bookingId = generateBookingId();

    // Create booking
    const [result] = await pool.execute(
      `INSERT INTO bookings (
        booking_id, user_id, room_id, guest_name, guest_email, guest_phone,
        check_in_date, check_in_time, check_out_date, check_out_time,
        num_adults, num_minors, minor_ages,
        price_per_night, total_nights, total_amount,
        payment_method, upi_app, payment_status, booking_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [
        bookingId,
        userId,
        room_id,
        full_name,
        email,
        phone,
        check_in_date,
        check_in_time,
        check_out_date,
        check_out_time,
        num_adults,
        num_minors || 0,
        JSON.stringify(minor_ages || []),
        pricePerNight,
        totalNights,
        totalAmount,
        payment_method,
        upi_app || null,
      ]
    );

    // Update room availability if needed
    await updateRoomAvailability(room_id);

    // Get booking details with room info
    const [bookingRows] = await pool.execute(
      `SELECT 
        b.*,
        r.title AS room_title,
        r.room_number,
        c.name AS category_name,
        r.thumbnail
      FROM bookings b
      INNER JOIN rooms r ON b.room_id = r.room_id
      LEFT JOIN room_categories c ON r.category_id = c.category_id
      WHERE b.booking_id = ?`,
      [bookingId]
    );

    const booking = bookingRows[0] as any;

    res.status(201).json(formatResponse(true, booking, 'Booking created successfully'));
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// GET /api/bookings/my - Get user bookings (requires auth)
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const [bookings] = await pool.execute(
      `SELECT 
        b.booking_id,
        b.room_id,
        r.title AS room_title,
        r.room_number,
        c.name AS category_name,
        r.thumbnail,
        CONCAT(b.check_in_date, ' ', b.check_in_time) AS check_in,
        CONCAT(b.check_out_date, ' ', b.check_out_time) AS check_out,
        b.total_nights,
        b.price_per_night,
        b.total_amount,
        b.payment_method,
        b.payment_status,
        b.booking_status,
        b.created_at
      FROM bookings b
      INNER JOIN rooms r ON b.room_id = r.room_id
      LEFT JOIN room_categories c ON r.category_id = c.category_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC`,
      [userId]
    );

    res.json(formatResponse(true, bookings));
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// Helper function to update room availability based on bookings
async function updateRoomAvailability(roomId: number) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if room has any active bookings
    const [activeBookings] = await pool.execute(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE room_id = ? 
       AND booking_status IN ('pending', 'confirmed')
       AND check_out_date >= ?`,
      [roomId, today]
    );

    const hasActiveBookings = (activeBookings[0] as any).count > 0;

    // Update room availability
    await pool.execute(
      'UPDATE rooms SET is_available = ? WHERE room_id = ?',
      [hasActiveBookings ? 0 : 1, roomId]
    );
  } catch (error) {
    console.error('Error updating room availability:', error);
  }
}

export default router;
