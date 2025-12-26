# Admin Panel Guide

## Overview

The admin panel provides a comprehensive interface for managing all aspects of the hotel booking system. Access it at `/admin` after logging in with admin credentials.

## Features

### 1. Dashboard (`/admin`)
- **Overview Statistics**: Total bookings, revenue, check-ins, occupancy rate
- **Recent Bookings**: Latest booking activity
- **Room Availability**: Real-time availability by category

### 2. Bookings Management (`/admin/bookings`)
- View all bookings with filtering options
- Update booking status (pending, confirmed, cancelled, completed, no_show)
- Update payment status (pending, completed, failed, refunded)
- Add admin remarks
- Delete bookings
- Filter by booking ID, date, or status

### 3. Users Management (`/admin/users`)
- View all registered users
- Search users by mobile number
- View user details and booking history
- Update user information
- Delete users
- Pagination support

### 4. Rooms Management (`/admin/rooms`)
- View all rooms with availability status
- Create new rooms
- Edit existing rooms
- Delete rooms
- Toggle room availability
- Enable/disable rooms

### 5. Room Form (`/admin/rooms/create` or `/admin/rooms/:id`)
- **Basic Information**: Room number, title, category, tagline, description
- **Pricing**: Base price, discount percentage
- **Facilities**: Add/remove room amenities
- **Settings**: Availability and enabled status
- Full validation and error handling

### 6. Categories Management (`/admin/categories`)
- View all room categories
- Create new categories
- Edit existing categories
- Delete categories
- Set display order and capacity

### 7. Inventory (`/admin/inventory`)
- **Overview**: Total rooms, available, booked, disabled
- **Category Breakdown**: Inventory statistics by category
- Utilization rates and visual indicators
- Real-time availability tracking

### 8. Reports (`/admin/reports`)
- **Date Range Selection**: Customizable reporting period
- **Summary Statistics**: Total bookings, confirmed, pending, revenue
- **Detailed Bookings**: Complete booking list for the period
- **Export to CSV**: Download reports for external analysis

### 9. Settings (`/admin/settings`)
- Manage global system settings
- Configure hotel information
- Update system preferences

## Navigation

The admin panel features:
- **Responsive Sidebar**: Navigate between sections easily
- **Mobile-Friendly**: Collapsible sidebar for mobile devices
- **Active State Indicators**: Visual feedback for current page
- **Quick Logout**: Access logout from sidebar

## Quick Actions

### Creating a New Room
1. Go to `/admin/rooms`
2. Click "Add Room"
3. Fill in room details
4. Add facilities
5. Set pricing and availability
6. Click "Create Room"

### Managing a Booking
1. Go to `/admin/bookings`
2. Find the booking (use filters if needed)
3. Click "Update Status"
4. Change booking/payment status
5. Add remarks if needed
6. Save changes

### Viewing Reports
1. Go to `/admin/reports`
2. Select start and end dates
3. Click "Generate Report"
4. View summary and detailed data
5. Export to CSV if needed

### Managing Inventory
1. Go to `/admin/inventory`
2. View overview statistics
3. Check category breakdown
4. Monitor utilization rates
5. Use data to manage room availability

## Admin Credentials

Default admin credentials:
- **Email**: `admin@hotel.com`
- **Password**: `admin123`

⚠️ **Important**: Change the default password in production!

## Access Control

- Only users with admin role can access `/admin/*` routes
- All admin routes are protected by authentication middleware
- Unauthorized access attempts redirect to login page

## Best Practices

1. **Regular Reports**: Generate weekly/monthly reports to track performance
2. **Room Availability**: Keep room status updated for accurate bookings
3. **User Management**: Regularly review and manage user accounts
4. **Booking Status**: Update booking statuses promptly
5. **Inventory Monitoring**: Check inventory regularly to optimize room allocation

