-- =============================================
-- Tree Suites Next Airport Inn - MySQL Database Schema
-- =============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS tree_suites_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tree_suites_db;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_mobile (mobile)
) ENGINE=InnoDB;

-- =============================================
-- ADMINS TABLE
-- =============================================
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- ROOM CATEGORIES TABLE
-- =============================================
CREATE TABLE room_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) DEFAULT 'bed',
    description TEXT,
    total_capacity INT NOT NULL DEFAULT 0,
    available_count INT NOT NULL DEFAULT 0,
    display_order INT DEFAULT 0,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_display_order (display_order),
    INDEX idx_enabled (is_enabled)
) ENGINE=InnoDB;

-- =============================================
-- ROOMS TABLE
-- =============================================
CREATE TABLE rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    short_tagline VARCHAR(255),
    long_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    offer_percentage DECIMAL(5, 2) DEFAULT 0,
    final_price DECIMAL(10, 2) GENERATED ALWAYS AS (price - (price * offer_percentage / 100)) STORED,
    thumbnail VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES room_categories(category_id) ON DELETE RESTRICT,
    INDEX idx_category (category_id),
    INDEX idx_available (is_available),
    INDEX idx_enabled (is_enabled),
    INDEX idx_price (final_price)
) ENGINE=InnoDB;

-- =============================================
-- ROOM IMAGES TABLE
-- =============================================
CREATE TABLE room_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    INDEX idx_room (room_id)
) ENGINE=InnoDB;

-- =============================================
-- ROOM FACILITIES TABLE
-- =============================================
CREATE TABLE room_facilities (
    facility_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    facility_name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    INDEX idx_room (room_id)
) ENGINE=InnoDB;

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE bookings (
    booking_id VARCHAR(20) PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    
    -- Guest Details
    guest_name VARCHAR(100) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(15) NOT NULL,
    
    -- Booking Details
    check_in_date DATE NOT NULL,
    check_in_time TIME DEFAULT '14:00:00',
    check_out_date DATE NOT NULL,
    check_out_time TIME DEFAULT '11:00:00',
    
    -- Guests Count
    num_adults INT NOT NULL DEFAULT 1,
    num_minors INT DEFAULT 0,
    minor_ages JSON,
    
    -- Pricing
    price_per_night DECIMAL(10, 2) NOT NULL,
    total_nights INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Payment
    payment_method ENUM('upi', 'pay_at_property') NOT NULL,
    upi_app VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    
    -- Booking Status
    booking_status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
    admin_remarks TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE RESTRICT,
    
    INDEX idx_user (user_id),
    INDEX idx_room (room_id),
    INDEX idx_status (booking_status),
    INDEX idx_check_in (check_in_date),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- =============================================
-- SETTINGS TABLE
-- =============================================
CREATE TABLE settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    
    FOREIGN KEY (updated_by) REFERENCES admins(admin_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================
-- AUTH TOKENS TABLE (for JWT refresh tokens)
-- =============================================
CREATE TABLE auth_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    admin_id INT,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE CASCADE,
    
    INDEX idx_token (token_hash),
    INDEX idx_user (user_id),
    INDEX idx_admin (admin_id)
) ENGINE=InnoDB;

-- =============================================
-- BOOKING SEQUENCE TABLE (for unique booking IDs)
-- =============================================
CREATE TABLE booking_sequence (
    sequence_date DATE PRIMARY KEY,
    last_sequence INT DEFAULT 0
) ENGINE=InnoDB;

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Default Admin
INSERT INTO admins (username, email, password_hash, full_name) VALUES
('admin', 'dhanuxhai@gmail.com', '$2y$10$placeholder_hash_replace_with_actual', 'Administrator');

-- Default Room Categories
INSERT INTO room_categories (name, slug, icon, description, total_capacity, available_count, display_order, is_enabled) VALUES
('Suite Room', 'suite-room', 'crown', 'Luxurious suite with premium amenities and spacious living area', 2, 2, 1, TRUE),
('Mini Suite Room', 'mini-suite-room', 'star', 'Compact luxury with essential suite amenities', 2, 2, 2, TRUE),
('Junior Suite Room', 'junior-suite-room', 'sparkles', 'Perfect blend of comfort and elegance', 2, 2, 3, TRUE),
('Deluxe AC Room', 'deluxe-ac-room', 'snowflake', 'Air-conditioned comfort with modern amenities', 7, 7, 4, TRUE),
('Deluxe Non AC Room', 'deluxe-non-ac-room', 'home', 'Comfortable budget-friendly accommodation', 7, 7, 5, TRUE);

-- Default Settings
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
('upi_id', '8792729715-4@ybl', 'string', 'UPI ID for payments'),
('whatsapp_number', '+918792729715', 'string', 'WhatsApp contact number'),
('phone_number', '+918792729715', 'string', 'Customer care phone number'),
('email', 'dhanuxhai@gmail.com', 'string', 'Contact email address'),
('hotel_name', 'Tree Suites Next Airport Inn', 'string', 'Hotel display name'),
('hotel_address', 'Kadiganahalli, Sai Bless, Jala Hobli, Subs Nagar, Chikkajala, Bengaluru, Karnataka 562157', 'string', 'Hotel address'),
('check_in_time', '14:00', 'string', 'Default check-in time'),
('check_out_time', '11:00', 'string', 'Default check-out time');

-- Sample Rooms
INSERT INTO rooms (room_number, title, category_id, short_tagline, long_description, price, offer_percentage, thumbnail, is_available, is_enabled) VALUES
('S101', 'Royal Suite', 1, 'Couple Friendly | 24x7 WiFi | Food Facility', 'Experience ultimate luxury in our Royal Suite featuring a king-size bed, premium bathroom amenities, city view balcony, and complimentary breakfast. Perfect for couples and business travelers seeking comfort and elegance.', 5999.00, 20, '/uploads/rooms/s101_thumb.jpg', TRUE, TRUE),
('S102', 'Presidential Suite', 1, 'Premium | Balcony | Complimentary Breakfast', 'The pinnacle of luxury accommodation with separate living area, premium amenities, and exceptional service.', 6999.00, 15, '/uploads/rooms/s102_thumb.jpg', TRUE, TRUE),
('MS201', 'Mini Suite Comfort', 2, 'Cozy | WiFi | Room Service', 'A perfect compact luxury space with all essential amenities for a comfortable stay.', 3999.00, 10, '/uploads/rooms/ms201_thumb.jpg', TRUE, TRUE),
('MS202', 'Mini Suite Deluxe', 2, 'Modern | AC | TV', 'Modern mini suite with contemporary design and comfortable furnishings.', 4299.00, 10, '/uploads/rooms/ms202_thumb.jpg', TRUE, TRUE),
('JS301', 'Junior Suite Classic', 3, 'Elegant | Spacious | WiFi', 'Elegant junior suite perfect for extended stays with ample space and comfort.', 4499.00, 15, '/uploads/rooms/js301_thumb.jpg', TRUE, TRUE),
('JS302', 'Junior Suite Premium', 3, 'City View | Premium Bed | AC', 'Premium junior suite with stunning city views and upgraded amenities.', 4799.00, 12, '/uploads/rooms/js302_thumb.jpg', TRUE, TRUE),
('DAC401', 'Deluxe AC Standard', 4, 'AC | WiFi | TV', 'Comfortable air-conditioned room with all modern amenities.', 2499.00, 10, '/uploads/rooms/dac401_thumb.jpg', TRUE, TRUE),
('DAC402', 'Deluxe AC Premium', 4, 'AC | Balcony | Room Service', 'Premium deluxe room with balcony and enhanced amenities.', 2799.00, 8, '/uploads/rooms/dac402_thumb.jpg', TRUE, TRUE),
('DNAC501', 'Deluxe Non-AC Standard', 5, 'Fan | WiFi | Budget Friendly', 'Budget-friendly room with essential amenities and great comfort.', 1499.00, 15, '/uploads/rooms/dnac501_thumb.jpg', TRUE, TRUE),
('DNAC502', 'Deluxe Non-AC Comfort', 5, 'Spacious | WiFi | TV', 'Spacious non-AC room perfect for budget travelers.', 1699.00, 10, '/uploads/rooms/dnac502_thumb.jpg', TRUE, TRUE);

-- Room Facilities for Sample Rooms
INSERT INTO room_facilities (room_id, facility_name, icon) VALUES
(1, 'King Size Bed', 'bed'),
(1, 'Air Conditioning', 'snowflake'),
(1, 'Free WiFi', 'wifi'),
(1, 'LCD TV', 'tv'),
(1, 'Mini Bar', 'wine'),
(1, 'Room Service', 'concierge-bell'),
(1, 'Balcony', 'door-open'),
(1, 'Attached Bathroom', 'bath'),
(2, 'King Size Bed', 'bed'),
(2, 'Air Conditioning', 'snowflake'),
(2, 'Free WiFi', 'wifi'),
(2, 'LCD TV', 'tv'),
(2, 'Living Area', 'sofa'),
(2, 'Work Desk', 'laptop'),
(3, 'Queen Size Bed', 'bed'),
(3, 'Air Conditioning', 'snowflake'),
(3, 'Free WiFi', 'wifi'),
(3, 'LCD TV', 'tv');

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Generate Unique Booking ID
DELIMITER //
CREATE PROCEDURE generate_booking_id(OUT new_booking_id VARCHAR(20))
BEGIN
    DECLARE current_date_str VARCHAR(8);
    DECLARE current_sequence INT;
    
    SET current_date_str = DATE_FORMAT(CURDATE(), '%Y%m%d');
    
    INSERT INTO booking_sequence (sequence_date, last_sequence)
    VALUES (CURDATE(), 1)
    ON DUPLICATE KEY UPDATE last_sequence = last_sequence + 1;
    
    SELECT last_sequence INTO current_sequence
    FROM booking_sequence
    WHERE sequence_date = CURDATE();
    
    SET new_booking_id = CONCAT('TSN', current_date_str, LPAD(current_sequence, 3, '0'));
END //
DELIMITER ;

-- Update Room Availability on Booking Confirmation
DELIMITER //
CREATE PROCEDURE update_room_availability(
    IN p_category_id INT,
    IN p_action ENUM('decrease', 'increase')
)
BEGIN
    IF p_action = 'decrease' THEN
        UPDATE room_categories
        SET available_count = available_count - 1
        WHERE category_id = p_category_id AND available_count > 0;
    ELSE
        UPDATE room_categories
        SET available_count = LEAST(available_count + 1, total_capacity)
        WHERE category_id = p_category_id;
    END IF;
END //
DELIMITER ;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger to update availability when booking is confirmed
DELIMITER //
CREATE TRIGGER after_booking_confirmed
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    DECLARE cat_id INT;
    
    IF NEW.booking_status = 'confirmed' AND OLD.booking_status = 'pending' THEN
        SELECT category_id INTO cat_id FROM rooms WHERE room_id = NEW.room_id;
        CALL update_room_availability(cat_id, 'decrease');
    END IF;
    
    IF NEW.booking_status = 'cancelled' AND OLD.booking_status = 'confirmed' THEN
        SELECT category_id INTO cat_id FROM rooms WHERE room_id = NEW.room_id;
        CALL update_room_availability(cat_id, 'increase');
    END IF;
END //
DELIMITER ;

-- =============================================
-- VIEWS
-- =============================================

-- View for Room Listings with Category Info
CREATE VIEW v_room_listings AS
SELECT 
    r.room_id,
    r.room_number,
    r.title,
    r.short_tagline,
    r.price,
    r.offer_percentage,
    r.final_price,
    r.thumbnail,
    r.is_available,
    r.is_enabled,
    c.category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    c.icon AS category_icon
FROM rooms r
JOIN room_categories c ON r.category_id = c.category_id
WHERE r.is_enabled = TRUE AND c.is_enabled = TRUE;

-- View for Pending Bookings (Admin Dashboard)
CREATE VIEW v_pending_bookings AS
SELECT 
    b.booking_id,
    b.guest_name,
    b.guest_phone,
    b.guest_email,
    r.title AS room_title,
    r.room_number,
    c.name AS category_name,
    b.check_in_date,
    b.check_out_date,
    b.num_adults,
    b.num_minors,
    b.total_amount,
    b.payment_method,
    b.created_at
FROM bookings b
JOIN rooms r ON b.room_id = r.room_id
JOIN room_categories c ON r.category_id = c.category_id
WHERE b.booking_status = 'pending'
ORDER BY b.created_at DESC;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_bookings_date_status ON bookings(check_in_date, booking_status);
CREATE INDEX idx_rooms_category_available ON rooms(category_id, is_available, is_enabled);
