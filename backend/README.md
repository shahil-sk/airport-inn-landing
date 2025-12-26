# Airport Inn Backend API

Backend REST API server for the Airport Inn booking system, built with Node.js, Express, TypeScript, and MySQL.

## Features

- ✅ Room Management (CRUD operations)
- ✅ Booking Management
- ✅ Category Management
- ✅ Admin endpoints for managing rooms and bookings
- ✅ MySQL database integration
- ✅ TypeScript for type safety
- ✅ Error handling middleware

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE tree_suites_db;
```

2. Run the database schema from `docs/DATABASE_SCHEMA.sql`:
```bash
mysql -u root -p tree_suites_db < ../docs/DATABASE_SCHEMA.sql
```

Or import it manually in your MySQL client.

### 3. Environment Configuration

1. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your database credentials:
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

### 4. Run the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### Public Routes

#### Rooms
- `GET /api/rooms` - Get all rooms (with optional filters: category, available, min_price, max_price)
- `GET /api/rooms/:id` - Get single room details

#### Bookings
- `POST /api/bookings/create` - Create a new booking
- `GET /api/bookings/my?email=<email>` - Get user bookings by email

### Admin Routes

#### Rooms Management
- `GET /api/admin/rooms` - Get all rooms (admin view)
- `POST /api/admin/rooms` - Create a new room
- `PUT /api/admin/rooms/:id` - Update a room
- `DELETE /api/admin/rooms/:id` - Delete a room

#### Bookings Management
- `GET /api/admin/bookings` - Get all bookings (with filters: status, booking_id, date, start_date, end_date)
- `GET /api/admin/bookings/pending` - Get pending bookings
- `PUT /api/admin/bookings/:id/status` - Update booking status
- `DELETE /api/admin/bookings/:id` - Delete a booking

### Health Check
- `GET /health` - Server health check

## Request/Response Format

All responses follow this format:

```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Example Requests

### Create a Room (Admin)
```bash
POST /api/admin/rooms
Content-Type: application/json

{
  "room_number": "S101",
  "title": "Royal Suite",
  "category_id": 1,
  "short_tagline": "Couple Friendly | 24x7 WiFi",
  "long_description": "Luxury suite with premium amenities...",
  "price": 5999,
  "offer_percentage": 20,
  "is_available": true,
  "is_enabled": true,
  "facilities": [
    {"name": "WiFi", "icon": "wifi"},
    {"name": "TV", "icon": "tv"}
  ]
}
```

### Create a Booking
```bash
POST /api/bookings/create
Content-Type: application/json

{
  "room_id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "check_in_date": "2025-02-01",
  "check_in_time": "14:00",
  "check_out_date": "2025-02-03",
  "check_out_time": "11:00",
  "num_adults": 2,
  "num_minors": 0,
  "payment_method": "pay_at_property"
}
```

## Development

### Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   │   ├── admin/       # Admin routes
│   │   ├── rooms.ts     # Room routes
│   │   └── bookings.ts  # Booking routes
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   └── index.ts         # Entry point
├── dist/                # Compiled JavaScript (generated)
├── .env                 # Environment variables (not in git)
└── package.json
```

### Type Checking

```bash
npm run type-check
```

## Notes

- The backend uses MySQL connection pooling for better performance
- Booking IDs are generated automatically in format: `TSN{YYYYMMDD}{NNN}`
- Room availability is checked before allowing bookings
- The backend validates dates and prevents double bookings

## Troubleshooting

### Connection Refused
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database exists

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using the port

### Type Errors
- Run `npm run type-check` to see detailed errors
- Ensure all dependencies are installed

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS settings
4. Use environment-specific database credentials
5. Set up proper logging
6. Use process managers like PM2

