import { Router, Request, Response } from 'express';
import pool from '../../config/database';
import { formatResponse } from '../../utils/helpers';
import { authenticate, requireAdmin, AuthRequest } from '../../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/users - Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const { mobile, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT user_id, full_name, email, mobile, created_at, is_active FROM users WHERE 1=1';
    const params: any[] = [];

    if (mobile) {
      query += ' AND mobile LIKE ?';
      params.push(`%${mobile}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [users] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams: any[] = [];
    if (mobile) {
      countQuery += ' AND mobile LIKE ?';
      countParams.push(`%${mobile}%`);
    }
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = (countResult[0] as any).total;

    res.json(
      formatResponse(true, {
        users,
        pagination: {
          current_page: Number(page),
          total_pages: Math.ceil(total / Number(limit)),
          total_users: total,
        },
      })
    );
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// GET /api/admin/users/:id - Get user details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [userRows] = await pool.execute(
      'SELECT user_id, full_name, email, mobile, created_at, is_active FROM users WHERE user_id = ?',
      [id]
    );

    if (!Array.isArray(userRows) || userRows.length === 0) {
      return res.status(404).json(formatResponse(false, undefined, undefined, 'User not found'));
    }

    // Get user bookings
    const [bookings] = await pool.execute(
      `SELECT 
        b.booking_id,
        r.title AS room_title,
        r.room_number,
        b.check_in_date,
        b.check_out_date,
        b.total_amount,
        b.booking_status,
        b.payment_status,
        b.created_at
      FROM bookings b
      INNER JOIN rooms r ON b.room_id = r.room_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC`,
      [id]
    );

    res.json(
      formatResponse(true, {
        user: userRows[0],
        bookings,
      })
    );
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// PUT /api/admin/users/:id - Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { full_name, email, mobile, is_active } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (full_name !== undefined) {
      updates.push('full_name = ?');
      params.push(full_name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (mobile !== undefined) {
      updates.push('mobile = ?');
      params.push(mobile);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'No fields to update')
      );
    }

    params.push(id);
    await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`, params);

    const [userRows] = await pool.execute(
      'SELECT user_id, full_name, email, mobile, created_at, is_active FROM users WHERE user_id = ?',
      [id]
    );

    res.json(formatResponse(true, userRows[0], 'User updated successfully'));
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user has active bookings
    const [bookings] = await pool.execute(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE user_id = ? AND booking_status IN ('pending', 'confirmed')`,
      [id]
    );

    if ((bookings[0] as any).count > 0) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Cannot delete user with active bookings')
      );
    }

    await pool.execute('DELETE FROM users WHERE user_id = ?', [id]);

    res.json(formatResponse(true, null, 'User deleted successfully'));
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

export default router;

