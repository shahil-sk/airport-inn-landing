# Airport Inn Landing Page

A modern, responsive landing page for Airport Inn with dynamic room booking system.

## Features

- 🏨 Dynamic room listings with real-time data
- 📱 Fully responsive design
- 🔍 Room detail pages with image galleries
- 📅 Booking system with date selection
- 🎨 Modern UI with shadcn/ui components
- ⚡ Fast performance with React Query
- 🚀 TypeScript for type safety

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack React Query
- **Routing**: React Router v6
- **Backend**: Node.js + Express + TypeScript + MySQL

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL (for backend)

### One-Command Setup (Recommended)

1. Install all dependencies (frontend + backend):
```bash
npm run install:all
```

2. Setup database and create admin account:
```bash
# Configure backend/.env with your database credentials first
npm run create-admin
```

3. Run both frontend and backend together:
```bash
npm run dev
```

This will start:
- Frontend at `http://localhost:8080`
- Backend at `http://localhost:3000`

### Separate Setup (Alternative)

If you prefer to run frontend and backend separately:

**Frontend:**
```bash
npm install
npm run dev:frontend
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm run dev
```

### Database Setup

1. Create the database:
```sql
CREATE DATABASE tree_suites_db;
```

2. Run the schema:
```bash
mysql -u root -p tree_suites_db < docs/DATABASE_SCHEMA.sql
```

## Project Structure

```
airport-inn-landing/
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui components
│   │   └── ...         # Feature components
│   ├── pages/          # Page components
│   │   ├── Index.tsx   # Home page
│   │   ├── RoomView.tsx # Room detail page
│   │   └── BookNow.tsx  # Booking page
│   ├── services/       # API services
│   └── ...
├── backend/            # Backend API server
├── docs/               # Documentation
└── ...
```

## Available Routes

- `/` - Home page with room listings
- `/room/:id` - Room detail page
- `/book/:id` - Booking page for a specific room

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features Overview

### Room Listings
- Fetches rooms from the backend API
- Displays room cards with images, prices, and amenities
- Links to individual room detail pages

### Room Detail Page
- Shows full room information
- Image gallery with thumbnail navigation
- Facilities and amenities list
- Direct booking button

### Booking Page
- Date picker for check-in/check-out
- Guest information form
- Payment method selection
- Real-time price calculation
- Booking confirmation

## API Integration

The frontend communicates with the backend API using the service layer in `src/services/api.ts`. 

Key API endpoints used:
- `GET /api/rooms` - Fetch all rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/bookings/create` - Create a booking

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private project - All rights reserved
