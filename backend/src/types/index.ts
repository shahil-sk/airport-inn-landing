export interface Room {
  room_id?: number;
  room_number: string;
  title: string;
  category_id: number;
  short_tagline?: string;
  long_description?: string;
  price: number;
  offer_percentage?: number;
  thumbnail?: string;
  is_available?: boolean;
  is_enabled?: boolean;
}

export interface RoomCategory {
  category_id?: number;
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
  total_capacity?: number;
  available_count?: number;
  display_order?: number;
  is_enabled?: boolean;
}

export interface RoomImage {
  image_id?: number;
  room_id: number;
  image_url: string;
  display_order?: number;
  is_primary?: boolean;
}

export interface RoomFacility {
  facility_id?: number;
  room_id: number;
  facility_name: string;
  icon?: string;
}

export interface Booking {
  booking_id?: string;
  user_id?: number;
  room_id: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_in_time?: string;
  check_out_date: string;
  check_out_time?: string;
  num_adults: number;
  num_minors?: number;
  minor_ages?: number[];
  price_per_night: number;
  total_nights: number;
  total_amount: number;
  payment_method: 'upi' | 'pay_at_property';
  upi_app?: string;
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  booking_status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  admin_remarks?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

