# Admin Account Credentials

## Default Admin Account

After running the admin creation script, use these credentials to login:

**Email**: `admin@hotel.com`  
**Password**: `admin123`

## How to Create Admin Account

### Method 1: Using Script (Recommended)

```bash
cd backend
npm install
npm run create-admin
```

### Method 2: Manual Database Entry

You can also manually create the admin by running SQL commands in your MySQL database.

## Authentication Testing

### Test Login API

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hotel.com",
    "password": "admin123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "full_name": "Administrator",
      "email": "admin@hotel.com",
      "mobile": "9999999999"
    },
    "role": "admin"
  }
}
```

### Test Admin Route

```bash
# First get token from login response, then:
curl http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Login

1. Start the frontend: `npm run dev`
2. Navigate to: `http://localhost:8080/login`
3. Enter credentials:
   - Email: `admin@hotel.com`
   - Password: `admin123`
4. You should be redirected to `/admin` dashboard

## Security Reminder

⚠️ **Important**: The default password `admin123` is for development only.  
**Change it immediately in production!**

## Troubleshooting

### Admin login not working?

1. Make sure the script ran successfully
2. Check database connection in `.env`
3. Verify admin exists: `SELECT * FROM admins WHERE email = 'admin@hotel.com'`
4. Verify user exists: `SELECT * FROM users WHERE email = 'admin@hotel.com'`
5. Check that both have the same password_hash
6. Verify JWT_SECRET is set in `.env`

### Role not detected as admin?

The system checks if the email exists in the `admins` table. Make sure:
- Admin record exists in `admins` table
- `is_active = 1` in admins table
- Email matches exactly between users and admins tables

