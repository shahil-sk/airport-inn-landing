# Creating Admin Account

## Quick Setup

To create an admin account, run:

```bash
cd backend
npm install  # Make sure dependencies are installed
npm run create-admin
```

This will create an admin account with the following credentials:

- **Email**: `admin@hotel.com`
- **Username**: `admin`
- **Password**: `admin123`

## Manual SQL Method

Alternatively, you can create the admin account directly in MySQL:

1. First, generate a password hash (you'll need to use bcrypt or run the script):

```sql
-- Option 1: Using the script (recommended)
-- Run: npm run create-admin

-- Option 2: Manual SQL (requires password hash)
-- You need to hash the password first using bcrypt
-- For 'admin123', the hash is: $2a$10$...
-- Then run:
INSERT INTO admins (username, email, password_hash, full_name, is_active) 
VALUES ('admin', 'admin@hotel.com', '$2a$10$YOUR_HASHED_PASSWORD_HERE', 'Administrator', 1)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), is_active = 1;

-- Also create user account for login
INSERT INTO users (full_name, email, mobile, password_hash, is_active) 
VALUES ('Administrator', 'admin@hotel.com', '9999999999', '$2a$10$YOUR_HASHED_PASSWORD_HERE', 1)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), is_active = 1;
```

## Login

After creating the admin account:

1. Go to `/login` in your frontend
2. Enter email: `admin@hotel.com`
3. Enter password: `admin123`
4. You will be redirected to `/admin` dashboard

## Authentication Flow

The authentication system works as follows:

1. **Login** (`POST /api/auth/login`):
   - Checks if user exists in `users` table
   - Verifies password using bcrypt
   - Checks if email exists in `admins` table to determine role
   - Returns JWT token with user info and role

2. **Protected Routes**:
   - All admin routes check for JWT token in Authorization header
   - Admin routes also verify the role is 'admin'
   - Frontend stores token in localStorage

3. **Token Usage**:
   - Token is sent in Authorization header: `Bearer <token>`
   - Token expires after 7 days (configurable in .env)
   - Token contains: userId, email, and role

## Changing Admin Password

To change the admin password, run the script again or update manually:

```bash
npm run create-admin
```

This will update the existing admin's password.

## Security Notes

- Default password is `admin123` - **CHANGE IT IN PRODUCTION!**
- Use strong passwords in production
- Store JWT_SECRET securely in production
- Consider implementing password reset functionality

