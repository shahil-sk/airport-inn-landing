import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { formatResponse, parseRowData, parseSingleRow } from '../utils/helpers';
import { Room, RoomImage, RoomFacility } from '../types';

const router = Router();

// GET /api/rooms - Get all rooms with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, available, min_price, max_price } = req.query;

    let query = `
      SELECT 
        r.*,
        c.name AS category_name,
        c.slug AS category_slug,
        c.icon AS category_icon,
        (SELECT image_url FROM room_images WHERE room_id = r.room_id AND is_primary = 1 LIMIT 1) AS thumbnail
      FROM rooms r
      INNER JOIN room_categories c ON r.category_id = c.category_id
      WHERE r.is_enabled = 1
    `;
    const params: any[] = [];

    if (category) {
      query += ' AND r.category_id = ?';
      params.push(category);
    }

    if (available !== undefined) {
      query += ' AND r.is_available = ?';
      params.push(available === 'true' ? 1 : 0);
    }

    if (min_price) {
      query += ' AND r.final_price >= ?';
      params.push(min_price);
    }

    if (max_price) {
      query += ' AND r.final_price <= ?';
      params.push(max_price);
    }

    query += ' ORDER BY r.room_id DESC';

    const [rows] = await pool.execute(query, params);

    // Get categories count
    const [categoryRows] = await pool.execute(`
      SELECT 
        c.*,
        COUNT(DISTINCT r.room_id) as total_rooms,
        COUNT(DISTINCT CASE WHEN r.is_available = 1 THEN r.room_id END) as available_rooms
      FROM room_categories c
      LEFT JOIN rooms r ON c.category_id = r.category_id AND r.is_enabled = 1
      WHERE c.is_enabled = 1
      GROUP BY c.category_id
      ORDER BY c.display_order ASC
    `);

    const categories = parseRowData(categoryRows);

    // Get images and facilities for each room
    const rooms = parseRowData<Room & { category_name: string; category_slug: string; category_icon: string; thumbnail: string }>(rows);
    
    for (const room of rooms) {
      // Get images
      const [imageRows] = await pool.execute(
        'SELECT image_url FROM room_images WHERE room_id = ? ORDER BY display_order ASC, is_primary DESC',
        [room.room_id]
      );
      (room as any).images = parseRowData<RoomImage>(imageRows).map(img => img.image_url);

      // Get facilities
      const [facilityRows] = await pool.execute(
        'SELECT facility_name, icon FROM room_facilities WHERE room_id = ?',
        [room.room_id]
      );
      (room as any).facilities = parseRowData<RoomFacility>(facilityRows).map(f => f.facility_name);
    }

    res.json(formatResponse(true, { categories, rooms }));
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// GET /api/rooms/:id - Get single room details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT 
        r.*,
        c.name AS category_name,
        c.slug AS category_slug,
        c.icon AS category_icon
      FROM rooms r
      INNER JOIN room_categories c ON r.category_id = c.category_id
      WHERE r.room_id = ? AND r.is_enabled = 1`,
      [id]
    );

    const room = parseSingleRow<Room & { category_name: string; category_slug: string; category_icon: string }>(rows);

    if (!room) {
      return res.status(404).json(formatResponse(false, undefined, undefined, 'Room not found'));
    }

    // Get images
    const [imageRows] = await pool.execute(
      'SELECT image_url, display_order, is_primary FROM room_images WHERE room_id = ? ORDER BY display_order ASC, is_primary DESC',
      [id]
    );
    (room as any).images = parseRowData<RoomImage>(imageRows).map(img => img.image_url);

    // Get facilities
    const [facilityRows] = await pool.execute(
      'SELECT facility_name, icon FROM room_facilities WHERE room_id = ?',
      [id]
    );
    (room as any).facilities = parseRowData<RoomFacility>(facilityRows).map(f => f.facility_name);

    // Get thumbnail
    const [thumbnailRows] = await pool.execute(
      'SELECT image_url FROM room_images WHERE room_id = ? AND is_primary = 1 LIMIT 1',
      [id]
    );
    if (thumbnailRows.length > 0) {
      (room as any).thumbnail = (thumbnailRows[0] as any).image_url;
    }

    res.json(formatResponse(true, room));
  } catch (error: any) {
    console.error('Error fetching room:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

export default router;

