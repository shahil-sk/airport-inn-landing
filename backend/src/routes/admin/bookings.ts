import { Router, Request, Response } from 'express';
import pool from '../../config/database';
import { formatResponse } from '../../utils/helpers';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/bookings - Get all bookings with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, booking_id, date, start_date, end_date } = req.query;

    let query = `
      SELECT 
        b.*,
        r.title AS room_title,
        r.room_number,
        c.name AS category_name,
        u.full_name AS user_name,
        u.email AS user_email,
        u.mobile AS user_mobile
      FROM bookings b
      INNER JOIN rooms r ON b.room_id = r.room_id
      LEFT JOIN room_categories c ON r.category_id = c.category_id
      LEFT JOIN users u ON b.user_id = u.user_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (booking_id) {
      query += ' AND b.booking_id = ?';
      params.push(booking_id);
    }

    if (status) {
      query += ' AND b.booking_status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND b.check_in_date = ?';
      params.push(date);
    }

    if (start_date && end_date) {
      query += ' AND b.check_in_date BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY b.created_at DESC';

    const [bookings] = await pool.execute(query, params);

    res.json(formatResponse(true, bookings));
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// GET /api/admin/bookings/pending - Get pending bookings
router.get('/pending', async (req: Request, res: Response) => {
  try {
    const [bookings] = await pool.execute(
      `SELECT 
        b.*,
        r.title AS room_title,
        r.room_number,
        c.name AS category_name,
        u.full_name AS user_name,
        u.email AS user_email,
        u.mobile AS user_mobile
      FROM bookings b
      INNER JOIN rooms r ON b.room_id = r.room_id
      LEFT JOIN room_categories c ON r.category_id = c.category_id
      LEFT JOIN users u ON b.user_id = u.user_id
      WHERE b.booking_status = 'pending'
      ORDER BY b.created_at DESC`
    );

    res.json(formatResponse(true, bookings));
  } catch (error: any) {
    console.error('Error fetching pending bookings:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// PUT /api/admin/bookings/:id/status - Update booking status
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { booking_status, payment_status, admin_remarks } = req.body;

    if (!booking_status) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'booking_status is required')
      );
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'];
    if (!validStatuses.includes(booking_status)) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Invalid booking status')
      );
    }

    // Get current booking to check room_id
    const [currentBooking] = await pool.execute(
      'SELECT room_id, booking_status FROM bookings WHERE booking_id = ?',
      [id]
    );

    if (!Array.isArray(currentBooking) || currentBooking.length === 0) {
      return res.status(404).json(formatResponse(false, undefined, undefined, 'Booking not found'));
    }

    const current = currentBooking[0] as any;
    const oldStatus = current.booking_status;

    const updates: string[] = ['booking_status = ?'];
    const params: any[] = [booking_status];

    if (payment_status) {
      updates.push('payment_status = ?');
      params.push(payment_status);
    }

    if (admin_remarks !== undefined) {
      updates.push('admin_remarks = ?');
      params.push(admin_remarks);
    }

    if (booking_status === 'confirmed') {
      updates.push('confirmed_at = NOW()');
    }

    if (booking_status === 'cancelled') {
      updates.push('cancelled_at = NOW()');
    }

    params.push(id);

    await pool.execute(
      `UPDATE bookings SET ${updates.join(', ')}, updated_at = NOW() WHERE booking_id = ?`,
      params
    );

    // Update room availability if status changed
    if (oldStatus !== booking_status) {
      await updateRoomAvailability(current.room_id);
    }

    // Get updated booking
    const [bookingRows] = await pool.execute(
      `SELECT 
        b.*,
        r.title AS room_title,
        r.room_number,
        c.name AS category_name
      FROM bookings b
      INNER JOIN rooms r ON b.room_id = r.room_id
      LEFT JOIN room_categories c ON r.category_id = c.category_id
      WHERE b.booking_id = ?`,
      [id]
    );

    res.json(formatResponse(true, bookingRows[0], 'Booking status updated successfully'));
  } catch (error: any) {
    console.error('Error updating booking:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// DELETE /api/admin/bookings/:id - Delete booking
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM bookings WHERE booking_id = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json(formatResponse(false, undefined, undefined, 'Booking not found'));
    }

    res.json(formatResponse(true, null, 'Booking deleted successfully'));
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// Helper function to update room availability
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

