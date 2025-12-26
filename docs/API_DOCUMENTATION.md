# Tree Suites Next Airport Inn - REST API Documentation

**Base URL:** `https://api.treesuitesnext.com`

---

## Authentication APIs

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "mobile": "9876543210",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirm_password": "SecurePass123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user_id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "created_at": "2025-01-26T10:30:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Email already registered"
}
```

---

### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### GET /api/auth/me
Get current authenticated user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "created_at": "2025-01-26T10:30:00Z"
  }
}
```

---

## Rooms APIs

### GET /api/rooms
Get all available rooms with optional filters.

**Query Parameters:**
- `category` (optional): Filter by category ID
- `available` (optional): Filter only available rooms (true/false)
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category_id": 1,
        "name": "Suite Room",
        "icon": "crown",
        "description": "Luxurious suite with premium amenities",
        "total_rooms": 2,
        "available_rooms": 1,
        "is_enabled": true,
        "display_order": 1
      }
    ],
    "rooms": [
      {
        "room_id": 1,
        "room_number": "S101",
        "title": "Royal Suite",
        "category_id": 1,
        "category_name": "Suite Room",
        "short_tagline": "Couple Friendly | 24x7 WiFi | Food Facility",
        "price": 5999,
        "offer_percentage": 20,
        "final_price": 4799,
        "thumbnail": "https://api.treesuitesnext.com/uploads/rooms/s101_thumb.jpg",
        "is_available": true,
        "is_enabled": true
      }
    ]
  }
}
```

---

### GET /api/rooms/{id}
Get detailed information about a specific room.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "room_id": 1,
    "room_number": "S101",
    "title": "Royal Suite",
    "category_id": 1,
    "category_name": "Suite Room",
    "short_tagline": "Couple Friendly | 24x7 WiFi | Food Facility",
    "long_description": "Experience luxury in our Royal Suite featuring a king-size bed, premium bathroom amenities, city view balcony, and complimentary breakfast. Perfect for couples and business travelers seeking comfort and elegance.",
    "price": 5999,
    "offer_percentage": 20,
    "final_price": 4799,
    "thumbnail": "https://api.treesuitesnext.com/uploads/rooms/s101_thumb.jpg",
    "images": [
      "https://api.treesuitesnext.com/uploads/rooms/s101_1.jpg",
      "https://api.treesuitesnext.com/uploads/rooms/s101_2.jpg",
      "https://api.treesuitesnext.com/uploads/rooms/s101_3.jpg"
    ],
    "facilities": [
      "King Size Bed",
      "Air Conditioning",
      "Free WiFi",
      "LCD TV",
      "Mini Bar",
      "Room Service",
      "Balcony",
      "Attached Bathroom"
    ],
    "is_available": true
  }
}
```

---

## Bookings APIs

### POST /api/bookings/create
Create a new booking (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
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
  "num_minors": 1,
  "minor_ages": [8],
  "payment_method": "upi",
  "upi_app": "gpay"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking_id": "TSN20250126001",
    "room_id": 1,
    "room_title": "Royal Suite",
    "room_number": "S101",
    "check_in": "2025-02-01 14:00",
    "check_out": "2025-02-03 11:00",
    "total_nights": 2,
    "price_per_night": 4799,
    "total_amount": 9598,
    "payment_method": "upi",
    "payment_status": "pending",
    "booking_status": "pending",
    "created_at": "2025-01-26T10:45:00Z",
    "upi_details": {
      "upi_id": "8792729715-4@ybl",
      "amount": 9598,
      "note": "TSN20250126001 - Royal Suite"
    }
  }
}
```

---

### GET /api/bookings/my
Get all bookings for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "booking_id": "TSN20250126001",
      "room_title": "Royal Suite",
      "room_number": "S101",
      "category_name": "Suite Room",
      "thumbnail": "https://api.treesuitesnext.com/uploads/rooms/s101_thumb.jpg",
      "check_in": "2025-02-01 14:00",
      "check_out": "2025-02-03 11:00",
      "total_amount": 9598,
      "payment_method": "upi",
      "payment_status": "completed",
      "booking_status": "confirmed",
      "created_at": "2025-01-26T10:45:00Z"
    }
  ]
}
```

---

## Admin APIs

### GET /api/admin/bookings/pending
Get all pending bookings.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "booking_id": "TSN20250126002",
      "user": {
        "user_id": 2,
        "full_name": "Jane Smith",
        "email": "jane@example.com",
        "mobile": "9876543211"
      },
      "room": {
        "room_id": 2,
        "title": "Mini Suite Comfort",
        "room_number": "MS201",
        "category_name": "Mini Suite Room"
      },
      "check_in": "2025-02-05 14:00",
      "check_out": "2025-02-06 11:00",
      "num_adults": 2,
      "num_minors": 0,
      "total_amount": 3599,
      "payment_method": "pay_at_property",
      "payment_status": "pending",
      "booking_status": "pending",
      "created_at": "2025-01-26T11:00:00Z"
    }
  ]
}
```

---

### POST /api/admin/bookings/approve
Approve or reject a booking.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "booking_id": "TSN20250126002",
  "action": "approve",
  "remarks": "Confirmed via phone"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Booking approved successfully",
  "data": {
    "booking_id": "TSN20250126002",
    "booking_status": "confirmed",
    "updated_at": "2025-01-26T12:00:00Z"
  }
}
```

---

### GET /api/admin/bookings/search
Search bookings by booking ID or date.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `booking_id` (optional): Search by booking ID
- `date` (optional): Filter by date (YYYY-MM-DD)
- `status` (optional): Filter by status (pending/confirmed/cancelled)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "booking_id": "TSN20250126001",
      "user": {
        "full_name": "John Doe",
        "mobile": "9876543210"
      },
      "room_title": "Royal Suite",
      "check_in": "2025-02-01 14:00",
      "check_out": "2025-02-03 11:00",
      "total_amount": 9598,
      "booking_status": "confirmed"
    }
  ]
}
```

---

### GET /api/admin/users
Get all registered users.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `mobile` (optional): Search by mobile number
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "user_id": 1,
        "full_name": "John Doe",
        "email": "john@example.com",
        "mobile": "9876543210",
        "total_bookings": 3,
        "created_at": "2025-01-26T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_users": 100
    }
  }
}
```

---

### GET /api/admin/users/{id}/bookings
Get booking history for a specific user.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 1,
      "full_name": "John Doe",
      "mobile": "9876543210"
    },
    "bookings": [
      {
        "booking_id": "TSN20250126001",
        "room_title": "Royal Suite",
        "check_in": "2025-02-01",
        "check_out": "2025-02-03",
        "total_amount": 9598,
        "booking_status": "confirmed"
      }
    ]
  }
}
```

---

### PUT /api/admin/settings
Update system settings.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "upi_id": "8792729715-4@ybl",
  "whatsapp_number": "+918792729715",
  "phone_number": "+918792729715",
  "email": "dhanuxhai@gmail.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "upi_id": "8792729715-4@ybl",
    "whatsapp_number": "+918792729715",
    "phone_number": "+918792729715",
    "email": "dhanuxhai@gmail.com",
    "updated_at": "2025-01-26T12:30:00Z"
  }
}
```

---

### GET /api/admin/settings
Get current system settings.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "upi_id": "8792729715-4@ybl",
    "whatsapp_number": "+918792729715",
    "phone_number": "+918792729715",
    "email": "dhanuxhai@gmail.com"
  }
}
```

---

## Admin - Rooms Management

### POST /api/admin/rooms
Create a new room.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
```
title: "Deluxe AC Room"
room_number: "DAC301"
category_id: 4
short_tagline: "AC | WiFi | TV"
long_description: "Comfortable air-conditioned room..."
price: 2999
offer_percentage: 15
thumbnail: [file]
images[]: [file1, file2, file3]
is_enabled: true
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "room_id": 10,
    "room_number": "DAC301",
    "title": "Deluxe AC Room"
  }
}
```

---

### PUT /api/admin/rooms/{id}
Update an existing room.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Deluxe AC Room Premium",
  "price": 3299,
  "offer_percentage": 10,
  "is_enabled": true
}
```

---

### DELETE /api/admin/rooms/{id}
Delete a room.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

---

## Admin - Categories Management

### GET /api/admin/categories
Get all categories.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "name": "Suite Room",
      "icon": "crown",
      "description": "Luxurious suite with premium amenities",
      "total_capacity": 2,
      "available_count": 1,
      "is_enabled": true,
      "display_order": 1
    }
  ]
}
```

---

### PUT /api/admin/categories/{id}
Update category settings.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "is_enabled": true,
  "display_order": 1,
  "total_capacity": 3
}
```

---

### POST /api/admin/categories
Create a new category.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Premium Suite",
  "icon": "star",
  "description": "Ultra-luxury accommodation",
  "total_capacity": 2,
  "display_order": 0
}
```

---

## Admin - Reports

### GET /api/admin/reports/bookings
Get booking report by date range.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `format` (optional): Response format (json/csv)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_bookings": 45,
      "confirmed": 38,
      "pending": 5,
      "cancelled": 2,
      "total_revenue": 185000
    },
    "bookings": [
      {
        "booking_id": "TSN20250126001",
        "guest_name": "John Doe",
        "room_title": "Royal Suite",
        "check_in": "2025-02-01",
        "check_out": "2025-02-03",
        "amount": 9598,
        "status": "confirmed"
      }
    ]
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Admin access required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Room not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```
