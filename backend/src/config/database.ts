import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tree_suites_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test database connection
pool.getConnection()
  .then((connection) => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error.message);
    console.error('Please check:');
    console.error('1. MySQL server is running');
    console.error('2. Database credentials in backend/.env are correct');
    console.error('3. Database exists: CREATE DATABASE tree_suites_db;');
    console.error('4. Schema is imported from docs/DATABASE_SCHEMA.sql');
  });

export default pool;

