import { Router, Request, Response } from 'express';
import pool from '../../config/database';
import { formatResponse, parseSingleRow } from '../../utils/helpers';
import { Room } from '../../types';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/rooms - Get all rooms (admin)
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        r.*,
        c.name AS category_name
      FROM rooms r
      LEFT JOIN room_categories c ON r.category_id = c.category_id
      ORDER BY r.room_id DESC
    `);

    res.json(formatResponse(true, rows));
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// POST /api/admin/rooms - Create new room
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      room_number,
      title,
      category_id,
      short_tagline,
      long_description,
      price,
      offer_percentage = 0,
      thumbnail,
      is_available = true,
      is_enabled = true,
      facilities,
    } = req.body;

    // Validate required fields
    if (!room_number || !title || !category_id || !price) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Missing required fields: room_number, title, category_id, price')
      );
    }

    // Check if room_number already exists
    const [existing] = await pool.execute(
      'SELECT room_id FROM rooms WHERE room_number = ?',
      [room_number]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Room number already exists')
      );
    }

    // Insert room
    const [result] = await pool.execute(
      `INSERT INTO rooms (
        room_number, title, category_id, short_tagline, long_description,
        price, offer_percentage, thumbnail, is_available, is_enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        room_number,
        title,
        category_id,
        short_tagline || null,
        long_description || null,
        price,
        offer_percentage,
        thumbnail || null,
        is_available ? 1 : 0,
        is_enabled ? 1 : 0,
      ]
    );

    const insertId = (result as any).insertId;

    // Insert facilities if provided
    if (facilities && Array.isArray(facilities)) {
      for (const facility of facilities) {
        await pool.execute(
          'INSERT INTO room_facilities (room_id, facility_name, icon) VALUES (?, ?, ?)',
          [insertId, facility.name || facility, facility.icon || null]
        );
      }
    }

    // Get created room
    const [roomRows] = await pool.execute('SELECT * FROM rooms WHERE room_id = ?', [insertId]);
    const room = parseSingleRow<Room>(roomRows);

    res.status(201).json(formatResponse(true, room, 'Room created successfully'));
  } catch (error: any) {
    console.error('Error creating room:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// PUT /api/admin/rooms/:id - Update room
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      room_number,
      title,
      category_id,
      short_tagline,
      long_description,
      price,
      offer_percentage,
      thumbnail,
      is_available,
      is_enabled,
      facilities,
    } = req.body;

    // Check if room exists
    const [existing] = await pool.execute('SELECT room_id FROM rooms WHERE room_id = ?', [id]);
    if (!Array.isArray(existing) || existing.length === 0) {
      return res.status(404).json(formatResponse(false, undefined, undefined, 'Room not found'));
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (room_number !== undefined) {
      // Check if new room_number conflicts with another room
      const [conflict] = await pool.execute(
        'SELECT room_id FROM rooms WHERE room_number = ? AND room_id != ?',
        [room_number, id]
      );
      if (Array.isArray(conflict) && conflict.length > 0) {
        return res.status(400).json(
          formatResponse(false, undefined, undefined, 'Room number already exists')
        );
      }
      updates.push('room_number = ?');
      values.push(room_number);
    }
    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (category_id !== undefined) { updates.push('category_id = ?'); values.push(category_id); }
    if (short_tagline !== undefined) { updates.push('short_tagline = ?'); values.push(short_tagline); }
    if (long_description !== undefined) { updates.push('long_description = ?'); values.push(long_description); }
    if (price !== undefined) { updates.push('price = ?'); values.push(price); }
    if (offer_percentage !== undefined) { updates.push('offer_percentage = ?'); values.push(offer_percentage); }
    if (thumbnail !== undefined) { updates.push('thumbnail = ?'); values.push(thumbnail); }
    if (is_available !== undefined) { updates.push('is_available = ?'); values.push(is_available ? 1 : 0); }
    if (is_enabled !== undefined) { updates.push('is_enabled = ?'); values.push(is_enabled ? 1 : 0); }

    if (updates.length > 0) {
      values.push(id);
      await pool.execute(
        `UPDATE rooms SET ${updates.join(', ')} WHERE room_id = ?`,
        values
      );
    }

    // Update facilities if provided
    if (facilities !== undefined && Array.isArray(facilities)) {
      // Delete existing facilities
      await pool.execute('DELETE FROM room_facilities WHERE room_id = ?', [id]);
      // Insert new facilities
      for (const facility of facilities) {
        await pool.execute(
          'INSERT INTO room_facilities (room_id, facility_name, icon) VALUES (?, ?, ?)',
          [id, facility.name || facility, facility.icon || null]
        );
      }
    }

    // Get updated room
    const [roomRows] = await pool.execute('SELECT * FROM rooms WHERE room_id = ?', [id]);
    const room = parseSingleRow<Room>(roomRows);

    res.json(formatResponse(true, room, 'Room updated successfully'));
  } catch (error: any) {
    console.error('Error updating room:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// PUT /api/admin/rooms/:id/availability - Manually set room availability
router.put('/:id/availability', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    if (typeof is_available !== 'boolean') {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'is_available must be a boolean')
      );
    }

    await pool.execute(
      'UPDATE rooms SET is_available = ? WHERE room_id = ?',
      [is_available ? 1 : 0, id]
    );

    const [roomRows] = await pool.execute('SELECT * FROM rooms WHERE room_id = ?', [id]);
    const room = parseSingleRow(roomRows);

    res.json(formatResponse(true, room, 'Room availability updated successfully'));
  } catch (error: any) {
    console.error('Error updating room availability:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// DELETE /api/admin/rooms/:id - Delete room
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if room exists
    const [existing] = await pool.execute('SELECT room_id FROM rooms WHERE room_id = ?', [id]);
    if (!Array.isArray(existing) || existing.length === 0) {
      return res.status(404).json(formatResponse(false, undefined, undefined, 'Room not found'));
    }

    // Check if room has active bookings
    const [bookings] = await pool.execute(
      `SELECT booking_id FROM bookings 
       WHERE room_id = ? AND booking_status IN ('pending', 'confirmed') 
       AND check_out_date >= CURDATE()`,
      [id]
    );

    if (Array.isArray(bookings) && bookings.length > 0) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Cannot delete room with active bookings')
      );
    }

    // Delete room (cascade will delete images and facilities)
    await pool.execute('DELETE FROM rooms WHERE room_id = ?', [id]);

    res.json(formatResponse(true, null, 'Room deleted successfully'));
  } catch (error: any) {
    console.error('Error deleting room:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

export default router;

