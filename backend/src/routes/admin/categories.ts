import { Router, Request, Response } from 'express';
import pool from '../../config/database';
import { formatResponse, parseSingleRow } from '../../utils/helpers';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/categories - Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const [categories] = await pool.execute(
      `SELECT 
        c.*,
        COUNT(DISTINCT r.room_id) as total_rooms,
        SUM(CASE WHEN r.is_available = 1 AND r.is_enabled = 1 THEN 1 ELSE 0 END) as available_rooms
      FROM room_categories c
      LEFT JOIN rooms r ON c.category_id = r.category_id
      GROUP BY c.category_id
      ORDER BY c.display_order ASC`
    );

    res.json(formatResponse(true, categories));
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// POST /api/admin/categories - Create category
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, slug, icon, description, total_capacity, display_order, is_enabled } = req.body;

    if (!name) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Name is required')
      );
    }

    // Generate slug if not provided
    const categorySlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    // Check if slug exists
    const [existing] = await pool.execute(
      'SELECT category_id FROM room_categories WHERE slug = ?',
      [categorySlug]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Category with this slug already exists')
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO room_categories (name, slug, icon, description, total_capacity, display_order, is_enabled, available_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        categorySlug,
        icon || 'bed',
        description || null,
        total_capacity || 0,
        display_order || 0,
        is_enabled !== undefined ? (is_enabled ? 1 : 0) : 1,
        total_capacity || 0,
      ]
    );

    const categoryId = (result as any).insertId;
    const [categoryRows] = await pool.execute(
      'SELECT * FROM room_categories WHERE category_id = ?',
      [categoryId]
    );

    res.status(201).json(formatResponse(true, categoryRows[0], 'Category created successfully'));
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// PUT /api/admin/categories/:id - Update category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, icon, description, total_capacity, display_order, is_enabled } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (slug !== undefined) {
      updates.push('slug = ?');
      params.push(slug);
    }
    if (icon !== undefined) {
      updates.push('icon = ?');
      params.push(icon);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (total_capacity !== undefined) {
      updates.push('total_capacity = ?');
      params.push(total_capacity);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      params.push(display_order);
    }
    if (is_enabled !== undefined) {
      updates.push('is_enabled = ?');
      params.push(is_enabled ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'No fields to update')
      );
    }

    params.push(id);
    await pool.execute(`UPDATE room_categories SET ${updates.join(', ')} WHERE category_id = ?`, params);

    const [categoryRows] = await pool.execute(
      'SELECT * FROM room_categories WHERE category_id = ?',
      [id]
    );

    res.json(formatResponse(true, categoryRows[0], 'Category updated successfully'));
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// DELETE /api/admin/categories/:id - Delete category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category has rooms
    const [rooms] = await pool.execute(
      'SELECT COUNT(*) as count FROM rooms WHERE category_id = ?',
      [id]
    );

    if ((rooms[0] as any).count > 0) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Cannot delete category with existing rooms')
      );
    }

    await pool.execute('DELETE FROM room_categories WHERE category_id = ?', [id]);

    res.json(formatResponse(true, null, 'Category deleted successfully'));
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

export default router;

