import pool from '../config/database';

// Function to update room availability based on checkout dates
export async function updateRoomAvailabilityFromBookings() {
  try {
    // Test connection first
    await pool.getConnection();
    
    const today = new Date().toISOString().split('T')[0];

    // Get all rooms
    const [rooms] = await pool.execute('SELECT room_id FROM rooms WHERE is_enabled = 1');

    for (const room of rooms as any[]) {
      // Check if room has any active bookings
      const [activeBookings] = await pool.execute(
        `SELECT COUNT(*) as count FROM bookings 
         WHERE room_id = ? 
         AND booking_status IN ('pending', 'confirmed')
         AND check_out_date >= ?`,
        [room.room_id, today]
      );

      const hasActiveBookings = (activeBookings[0] as any).count > 0;

      // Update room availability
      await pool.execute(
        'UPDATE rooms SET is_available = ? WHERE room_id = ?',
        [hasActiveBookings ? 0 : 1, room.room_id]
      );
    }

    console.log(`[${new Date().toISOString()}] Room availability updated`);
  } catch (error: any) {
    // Only log if it's not a connection error (to avoid spam)
    if (error.code !== 'ECONNREFUSED' && error.code !== 'ER_ACCESS_DENIED_ERROR') {
      console.error('Error updating room availability:', error.message);
    }
    // Silently fail for connection errors - will retry on next run
  }
}

// Run this function periodically (every hour)
export function startRoomAvailabilityScheduler() {
  // Test database connection before starting scheduler
  pool.getConnection()
    .then(() => {
      console.log('📅 Room availability scheduler started');
      // Run immediately on start
      updateRoomAvailabilityFromBookings();

      // Then run every hour
      setInterval(() => {
        updateRoomAvailabilityFromBookings();
      }, 60 * 60 * 1000); // 1 hour
    })
    .catch((error) => {
      console.warn('⚠️  Database not available - scheduler will not start');
      console.warn('   Room availability updates will resume once database is connected');
    });
}

