# Fixing MySQL Password Issue

The error "Access denied for user 'root'@'localhost' (using password: YES)" means your MySQL password in `backend/.env` is incorrect.

## Quick Fix

### Option 1: If MySQL has NO password (most common on fresh installs)

Edit `backend/.env` and set:
```env
DB_PASSWORD=
```

Or remove the password field entirely if it's optional.

### Option 2: If MySQL has a password

1. Edit `backend/.env`:
```bash
cd backend
nano .env
# or
code .env
```

2. Update the DB_PASSWORD line with your actual MySQL password:
```env
DB_PASSWORD=your_actual_mysql_password
```

3. Save and restart the server:
```bash
npm run dev
```

### Option 3: Reset MySQL root password (if you forgot it)

If you don't remember your MySQL password:

```bash
# Stop MySQL
brew services stop mysql

# Start MySQL in safe mode (no password required)
mysqld_safe --skip-grant-tables &

# Connect to MySQL
mysql -u root

# In MySQL prompt, reset password:
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
# OR set a new password:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';

# Exit MySQL
EXIT;

# Restart MySQL normally
brew services stop mysql
brew services start mysql
```

## Verify Password

Test your password works:
```bash
mysql -u root -p
# Enter your password when prompted
# If it works, you're good!
```

## After Fixing

Once `.env` has the correct password, restart:
```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
📅 Room availability scheduler started
```

