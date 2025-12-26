import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import roomsRouter from './routes/rooms';
import adminRoomsRouter from './routes/admin/rooms';
import bookingsRouter from './routes/bookings';
import adminBookingsRouter from './routes/admin/bookings';
import adminUsersRouter from './routes/admin/users';
import adminCategoriesRouter from './routes/admin/categories';
import adminDashboardRouter from './routes/admin/dashboard';
import adminSettingsRouter from './routes/admin/settings';
import { errorHandler } from './middleware/errorHandler';
import { formatResponse } from './utils/helpers';
import { startRoomAvailabilityScheduler } from './utils/scheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json(formatResponse(true, { status: 'ok', timestamp: new Date().toISOString() }));
});

// Public Routes
app.use('/api/auth', authRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

// Admin Routes
app.use('/api/admin/dashboard', adminDashboardRouter);
app.use('/api/admin/rooms', adminRoomsRouter);
app.use('/api/admin/bookings', adminBookingsRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin/categories', adminCategoriesRouter);
app.use('/api/admin/settings', adminSettingsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json(formatResponse(false, undefined, undefined, 'Route not found'));
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start room availability scheduler (will check DB connection first)
  startRoomAvailabilityScheduler();
});

