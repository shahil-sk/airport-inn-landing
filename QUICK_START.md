# Quick Start Guide

## One-Command Setup & Run

### 1. Install All Dependencies (First Time Only)

```bash
npm run install:all
```

This installs dependencies for both frontend and backend.

### 2. Setup Database & Admin Account

```bash
# Make sure your MySQL database is running and configured in backend/.env
# Then create admin account:
npm run create-admin
```

### 3. Run Both Frontend & Backend Together

```bash
npm run dev
```

This single command runs:
- Backend server on `http://localhost:3000`
- Frontend server on `http://localhost:8080`

## Available Commands

- `npm run dev` - Run both backend and frontend (recommended)
- `npm run dev:frontend` - Run only frontend
- `npm run dev:backend` - Run only backend
- `npm run install:all` - Install all dependencies (frontend + backend)
- `npm run create-admin` - Create admin account
- `npm run build` - Build frontend for production
- `npm run build:backend` - Build backend for production

## Default Admin Credentials

After running `npm run create-admin`:

- **Email:** `admin@hotel.com`
- **Password:** `admin123`

## Environment Setup

### Frontend (.env - optional)
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Backend (backend/.env - required)
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

## First Time Setup Checklist

1. ✅ Install dependencies: `npm run install:all`
2. ✅ Setup MySQL database using `docs/DATABASE_SCHEMA.sql`
3. ✅ Configure `backend/.env` with database credentials
4. ✅ Create admin account: `npm run create-admin`
5. ✅ Run the application: `npm run dev`
6. ✅ Access frontend: `http://localhost:8080`
7. ✅ Login as admin: `http://localhost:8080/login`
8. ✅ Access admin panel: `http://localhost:8080/admin`

## Troubleshooting

### Port Already in Use

If port 3000 or 8080 is already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `vite.config.ts`

### Database Connection Error

- Check MySQL is running
- Verify credentials in `backend/.env`
- Ensure database exists: `CREATE DATABASE tree_suites_db;`
- Run schema: `mysql -u root -p tree_suites_db < docs/DATABASE_SCHEMA.sql`

### Module Not Found Errors

Run: `npm run install:all` to ensure all dependencies are installed.

