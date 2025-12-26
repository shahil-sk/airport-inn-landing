# Database Setup Guide

## Quick Setup

The `ECONNREFUSED` error means MySQL is not running or not configured correctly.

### Step 1: Check if MySQL is Running

**macOS (using Homebrew):**
```bash
brew services list
# If MySQL is installed but not running:
brew services start mysql
```

**macOS (using MySQL installer):**
```bash
# Check if MySQL is running:
sudo /usr/local/mysql/support-files/mysql.server status

# Start MySQL if not running:
sudo /usr/local/mysql/support-files/mysql.server start
```

**Linux:**
```bash
sudo systemctl status mysql
# If not running:
sudo systemctl start mysql
```

**Windows:**
- Open Services (Win + R, type `services.msc`)
- Find MySQL service and start it

### Step 2: Create Database

Connect to MySQL:
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE IF NOT EXISTS tree_suites_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 3: Import Schema

```bash
mysql -u root -p tree_suites_db < docs/DATABASE_SCHEMA.sql
```

### Step 4: Configure Backend Environment

Create `backend/.env` file:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tree_suites_db
DB_PORT=3306
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

### Step 5: Test Connection

```bash
mysql -u root -p tree_suites_db
```

If you can connect, the database is ready.

### Step 6: Create Admin Account

```bash
npm run create-admin
```

### Step 7: Start the Application

```bash
npm run dev
```

## Troubleshooting

### "Access denied for user 'root'@'localhost'"

This means the password is wrong. Try:
1. Check if you have a MySQL password set
2. Try with empty password (if no password is set)
3. Reset MySQL root password if needed

### "Can't connect to MySQL server"

1. **Check if MySQL is running:**
   ```bash
   # macOS
   brew services list | grep mysql
   
   # Linux
   sudo systemctl status mysql
   ```

2. **Check MySQL port:**
   - Default is 3306
   - Verify in `backend/.env` file

3. **Check MySQL socket (macOS):**
   ```bash
   mysql_config --socket
   ```
   You might need to add this to `.env`:
   ```env
   DB_SOCKET=/tmp/mysql.sock
   ```

### "Unknown database 'tree_suites_db'"

Create the database:
```sql
CREATE DATABASE tree_suites_db;
```

### Connection Works But Tables Don't Exist

Import the schema:
```bash
mysql -u root -p tree_suites_db < docs/DATABASE_SCHEMA.sql
```

## Verify Setup

After setup, you should see in the backend logs:
```
✅ Database connected successfully
📅 Room availability scheduler started
Server is running on port 3000
```

If you see these messages, everything is configured correctly! 🎉

