import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tree_suites_db',
  });

  try {
    const username = 'admin';
    const email = 'admin@hotel.com';
    const password = 'admin123';
    const fullName = 'Administrator';

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT admin_id FROM admins WHERE email = ? OR username = ?',
      [email, username]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      console.log('Admin already exists. Updating password...');
      await connection.execute(
        'UPDATE admins SET password_hash = ?, is_active = 1 WHERE email = ? OR username = ?',
        [passwordHash, email, username]
      );
      console.log('Admin password updated successfully!');
    } else {
      // Create admin
      await connection.execute(
        'INSERT INTO admins (username, email, password_hash, full_name, is_active) VALUES (?, ?, ?, ?, 1)',
        [username, email, passwordHash, fullName]
      );
      console.log('Admin created successfully!');
    }

    // Also create/update user with same email for login compatibility
    const [existingUser] = await connection.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      await connection.execute(
        'UPDATE users SET password_hash = ?, is_active = 1 WHERE email = ?',
        [passwordHash, email]
      );
      console.log('User account updated for admin login.');
    } else {
      await connection.execute(
        'INSERT INTO users (full_name, email, mobile, password_hash, is_active) VALUES (?, ?, ?, ?, 1)',
        [fullName, email, '9999999999', passwordHash]
      );
      console.log('User account created for admin login.');
    }

    console.log('\n========================================');
    console.log('ADMIN CREDENTIALS:');
    console.log('========================================');
    console.log('Email:    ', email);
    console.log('Username: ', username);
    console.log('Password: ', password);
    console.log('========================================\n');
    console.log('You can now login at: /login');
    console.log('Admin panel: /admin\n');

  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

createAdmin();

