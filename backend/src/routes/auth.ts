import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { formatResponse, parseSingleRow } from '../utils/helpers';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { full_name, email, mobile, password, confirm_password } = req.body;

    // Validation
    if (!full_name || !email || !mobile || !password) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'All fields are required')
      );
    }

    if (password !== confirm_password) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Passwords do not match')
      );
    }

    if (password.length < 6) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Password must be at least 6 characters')
      );
    }

    // Check if user already exists
    const [existingEmail] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingEmail) && existingEmail.length > 0) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Email already registered')
      );
    }

    const [existingMobile] = await pool.execute(
      'SELECT user_id FROM users WHERE mobile = ?',
      [mobile]
    );

    if (Array.isArray(existingMobile) && existingMobile.length > 0) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Mobile number already registered')
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, mobile, password_hash) VALUES (?, ?, ?, ?)',
      [full_name, email, mobile, passwordHash]
    );

    const userId = (result as any).insertId;

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Get user data (without password)
    const [userRows] = await pool.execute(
      'SELECT user_id, full_name, email, mobile, created_at FROM users WHERE user_id = ?',
      [userId]
    );

    const user = parseSingleRow(userRows);

    res.status(201).json(
      formatResponse(true, { token, user }, 'Registration successful')
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        formatResponse(false, undefined, undefined, 'Email and password are required')
      );
    }

    // Test database connection first
    try {
      await pool.getConnection().then(conn => conn.release());
    } catch (dbError: any) {
      console.error('Database connection error:', dbError.message);
      return res.status(503).json(
        formatResponse(false, undefined, undefined, 'Database connection failed. Please check if MySQL is running and configured correctly.')
      );
    }

    // Find user
    const [userRows] = await pool.execute(
      'SELECT user_id, full_name, email, mobile, password_hash, is_active FROM users WHERE email = ?',
      [email]
    );

    const user = parseSingleRow(userRows);

    if (!user) {
      return res.status(401).json(
        formatResponse(false, undefined, undefined, 'Invalid email or password')
      );
    }

    if (!user.is_active) {
      return res.status(403).json(
        formatResponse(false, undefined, undefined, 'Account is deactivated')
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json(
        formatResponse(false, undefined, undefined, 'Invalid email or password')
      );
    }

    // Check if admin
    const [adminRows] = await pool.execute(
      'SELECT admin_id FROM admins WHERE email = ? AND is_active = 1',
      [email]
    );

    const role = Array.isArray(adminRows) && adminRows.length > 0 ? 'admin' : 'user';

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json(
      formatResponse(true, { token, user: userWithoutPassword, role }, 'Login successful')
    );
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// GET /api/auth/me - Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        formatResponse(false, undefined, undefined, 'No token provided')
      );
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    try {
      const decoded = jwt.verify(token, secret) as any;

      const [userRows] = await pool.execute(
        'SELECT user_id, full_name, email, mobile, created_at FROM users WHERE user_id = ?',
        [decoded.userId]
      );

      const user = parseSingleRow(userRows);

      if (!user) {
        return res.status(404).json(
          formatResponse(false, undefined, undefined, 'User not found')
        );
      }

      res.json(formatResponse(true, { ...user, role: decoded.role }));
    } catch (error) {
      return res.status(401).json(
        formatResponse(false, undefined, undefined, 'Invalid or expired token')
      );
    }
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

export default router;

