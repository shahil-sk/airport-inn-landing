import { Router, Request, Response } from 'express';
import pool from '../../config/database';
import { formatResponse } from '../../utils/helpers';
import { authenticate, requireAdmin, AuthRequest } from '../../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/', async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Total Bookings
    const [totalBookings] = await pool.execute(
      'SELECT COUNT(*) as total FROM bookings'
    );
    const totalBookingsCount = (totalBookings[0] as any).total;

    // Bookings this month
    const [thisMonthBookings] = await pool.execute(
      'SELECT COUNT(*) as total FROM bookings WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())'
    );
    const thisMonthCount = (thisMonthBookings[0] as any).total;

    // Last month bookings
    const [lastMonthBookings] = await pool.execute(
      'SELECT COUNT(*) as total FROM bookings WHERE MONTH(created_at) = MONTH(?) AND YEAR(created_at) = YEAR(?)',
      [lastMonth, lastMonth]
    );
    const lastMonthCount = (lastMonthBookings[0] as any).total;
    const bookingChange = lastMonthCount > 0 
      ? ((thisMonthCount - lastMonthCount) / lastMonthCount * 100).toFixed(1)
      : '0';

    // Revenue
    const [revenue] = await pool.execute(
      `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM bookings 
       WHERE payment_status = 'completed' AND booking_status != 'cancelled'`
    );
    const totalRevenue = (revenue[0] as any).total;

    // This month revenue
    const [thisMonthRevenue] = await pool.execute(
      `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM bookings 
       WHERE payment_status = 'completed' 
       AND booking_status != 'cancelled'
       AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
       AND YEAR(created_at) = YEAR(CURRENT_DATE())`
    );
    const thisMonthRevenueTotal = (thisMonthRevenue[0] as any).total;

    // Last month revenue
    const [lastMonthRevenue] = await pool.execute(
      `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM bookings 
       WHERE payment_status = 'completed' 
       AND booking_status != 'cancelled'
       AND MONTH(created_at) = MONTH(?) AND YEAR(created_at) = YEAR(?)`,
      [lastMonth, lastMonth]
    );
    const lastMonthRevenueTotal = (lastMonthRevenue[0] as any).total;
    const revenueChange = lastMonthRevenueTotal > 0
      ? ((thisMonthRevenueTotal - lastMonthRevenueTotal) / lastMonthRevenueTotal * 100).toFixed(1)
      : '0';

    // Registered Users
    const [users] = await pool.execute('SELECT COUNT(*) as total FROM users');
    const totalUsers = (users[0] as any).total;

    // New users this week
    const [newUsers] = await pool.execute(
      'SELECT COUNT(*) as total FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    const newUsersCount = (newUsers[0] as any).total;

    // Occupancy Rate
    const [totalRooms] = await pool.execute(
      'SELECT COUNT(*) as total FROM rooms WHERE is_enabled = 1'
    );
    const totalRoomsCount = (totalRooms[0] as any).total;

    const [occupiedRooms] = await pool.execute(
      `SELECT COUNT(DISTINCT room_id) as total 
       FROM bookings 
       WHERE booking_status IN ('pending', 'confirmed') 
       AND check_in_date <= ? AND check_out_date > ?`,
      [today, today]
    );
    const occupiedCount = (occupiedRooms[0] as any).total;
    const occupancyRate = totalRoomsCount > 0 
      ? ((occupiedCount / totalRoomsCount) * 100).toFixed(0)
      : '0';

    // Yesterday occupancy
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const [yesterdayOccupied] = await pool.execute(
      `SELECT COUNT(DISTINCT room_id) as total 
       FROM bookings 
       WHERE booking_status IN ('pending', 'confirmed') 
       AND check_in_date <= ? AND check_out_date > ?`,
      [yesterdayStr, yesterdayStr]
    );
    const yesterdayOccupiedCount = (yesterdayOccupied[0] as any).total;
    const yesterdayOccupancyRate = totalRoomsCount > 0
      ? ((yesterdayOccupiedCount / totalRoomsCount) * 100).toFixed(0)
      : '0';
    const occupancyChange = ((Number(occupancyRate) - Number(yesterdayOccupancyRate)).toFixed(0));

    // Pending bookings
    const [pending] = await pool.execute(
      "SELECT COUNT(*) as total FROM bookings WHERE booking_status = 'pending'"
    );
    const pendingCount = (pending[0] as any).total;

    // Check-ins today
    const [checkins] = await pool.execute(
      'SELECT COUNT(*) as total FROM bookings WHERE check_in_date = ? AND booking_status = "confirmed"',
      [today]
    );
    const checkinsCount = (checkins[0] as any).total;

    // Available rooms
    const [available] = await pool.execute(
      'SELECT COUNT(*) as total FROM rooms WHERE is_available = 1 AND is_enabled = 1'
    );
    const availableCount = (available[0] as any).total;

    // Recent bookings
    const [recentBookings] = await pool.execute(
      `SELECT 
        b.booking_id,
        b.guest_name,
        b.guest_phone,
        r.title AS room_title,
        r.room_number,
        b.check_in_date,
        b.total_amount,
        b.payment_method,
        b.booking_status,
        b.payment_status,
        b.created_at
      FROM bookings b
      INNER JOIN rooms r ON b.room_id = r.room_id
      ORDER BY b.created_at DESC
      LIMIT 10`
    );

    // Room availability by category
    const [roomAvailability] = await pool.execute(
      `SELECT 
        c.name AS category_name,
        COUNT(r.room_id) as total_rooms,
        SUM(CASE WHEN r.is_available = 1 THEN 1 ELSE 0 END) as available_rooms
      FROM room_categories c
      LEFT JOIN rooms r ON c.category_id = r.category_id AND r.is_enabled = 1
      WHERE c.is_enabled = 1
      GROUP BY c.category_id, c.name
      ORDER BY c.display_order`
    );

    res.json(
      formatResponse(true, {
        stats: {
          total_bookings: totalBookingsCount,
          booking_change: bookingChange,
          revenue: totalRevenue,
          revenue_change: revenueChange,
          total_users: totalUsers,
          new_users_week: newUsersCount,
          occupancy_rate: occupancyRate,
          occupancy_change: occupancyChange,
        },
        daily: {
          pending: pendingCount,
          checkins: checkinsCount,
          available: availableCount,
        },
        recent_bookings: recentBookings,
        room_availability: roomAvailability,
      })
    );
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

export default router;

