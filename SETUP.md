# Complete Setup Guide

## Quick Start (Everything in One Go)

### Step 1: Install All Dependencies

```bash
npm run install:all
```

This command:
- Installs frontend dependencies
- Installs backend dependencies

### Step 2: Setup Database

1. Make sure MySQL is running
2. Create the database:
```sql
CREATE DATABASE tree_suites_db;
```

3. Import the schema:
```bash
mysql -u root -p tree_suites_db < docs/DATABASE_SCHEMA.sql
```

### Step 3: Configure Backend Environment

1. Copy the example file:
```bash
cp backend/.env.example backend/.env
```

2. Edit `backend/.env` with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tree_suites_db
DB_PORT=3306
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

### Step 4: Create Admin Account

```bash
npm run create-admin
```

This will create an admin account with:
- Email: `admin@hotel.com`
- Password: `admin123`

### Step 5: Run Everything

```bash
npm run dev
```

This single command runs:
- ✅ Backend server on `http://localhost:3000`
- ✅ Frontend server on `http://localhost:8080`

You'll see output from both servers with color-coded prefixes:
- `[backend]` - Backend server logs
- `[frontend]` - Frontend server logs

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both backend and frontend together |
| `npm run dev:frontend` | Run only frontend |
| `npm run dev:backend` | Run only backend |
| `npm run install:all` | Install all dependencies (frontend + backend) |
| `npm run create-admin` | Create admin account |
| `npm run build` | Build frontend for production |
| `npm run build:backend` | Build backend for production |

## Access Points

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Admin Login**: http://localhost:8080/login
- **Admin Panel**: http://localhost:8080/admin

## Admin Credentials

- **Email**: `admin@hotel.com`
- **Password**: `admin123`

⚠️ **Change the password in production!**

## Troubleshooting

### Port Already in Use

If you see port errors:

**Backend (port 3000):**
- Change `PORT` in `backend/.env`

**Frontend (port 8080):**
- Edit `vite.config.ts` and change the port

### Dependencies Not Installed

Run: `npm run install:all`

### Database Connection Error

1. Verify MySQL is running
2. Check credentials in `backend/.env`
3. Ensure database exists
4. Verify schema is imported

### Module Not Found

Make sure you ran `npm run install:all` to install all dependencies.

## Project Structure

```
airport-inn-landing/
├── src/              # Frontend React code
├── backend/          # Backend Express API
│   ├── src/         # Backend source code
│   └── .env         # Backend environment variables
├── docs/            # Database schema and documentation
└── package.json     # Root package.json with unified commands
```

## Development Workflow

1. Start development: `npm run dev`
2. Make changes to frontend or backend
3. Both servers auto-reload on changes
4. Access frontend at http://localhost:8080
5. API calls go to http://localhost:3000

That's it! Everything runs with a single command now. 🚀

