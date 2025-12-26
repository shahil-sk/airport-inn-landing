// Tree Suites Next Airport Inn - API Service
// Base URL for all API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Types
export interface User {
  user_id: number;
  full_name: string;
  email: string;
  mobile: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface Room {
  room_id: number;
  room_number: string;
  title: string;
  category_id: number;
  category_name: string;
  short_tagline: string;
  long_description?: string;
  price: number;
  offer_percentage: number;
  final_price: number;
  thumbnail: string;
  images?: string[];
  facilities?: string[];
  is_available: boolean;
  is_enabled: boolean;
}

export interface RoomCategory {
  category_id: number;
  name: string;
  icon: string;
  description: string;
  total_rooms: number;
  available_rooms: number;
  is_enabled: boolean;
  display_order: number;
}

export interface Booking {
  booking_id: string;
  room_id: number;
  room_title: string;
  room_number: string;
  category_name?: string;
  thumbnail?: string;
  check_in: string;
  check_out: string;
  total_nights?: number;
  price_per_night?: number;
  total_amount: number;
  payment_method: 'upi' | 'pay_at_property';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  created_at: string;
  upi_details?: {
    upi_id: string;
    amount: number;
    note: string;
  };
}

export interface BookingRequest {
  room_id: number;
  full_name: string;
  email: string;
  phone: string;
  check_in_date: string;
  check_in_time: string;
  check_out_date: string;
  check_out_time: string;
  num_adults: number;
  num_minors: number;
  minor_ages?: number[];
  payment_method: 'upi' | 'pay_at_property';
  upi_app?: string;
}

export interface Settings {
  upi_id: string;
  whatsapp_number: string;
  phone_number: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

// =============================================
// AUTH APIs
// =============================================

export interface AuthData {
  token: string;
  user: User;
  role?: 'user' | 'admin';
}

export const authApi = {
  register: async (userData: {
    full_name: string;
    mobile: string;
    email: string;
    password: string;
    confirm_password: string;
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthData>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.role) {
        localStorage.setItem('user_role', response.data.role);
      }
    }
    
    return response as AuthResponse;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthData>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.role) {
        localStorage.setItem('user_role', response.data.role);
      }
    }
    
    return response as AuthResponse;
  },

  getMe: async (): Promise<ApiResponse<User & { role?: string }>> => {
    return apiRequest<User & { role?: string }>('/api/auth/me');
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
  },

  isLoggedIn: (): boolean => {
    return !!getAuthToken();
  },

  isAdmin: (): boolean => {
    return localStorage.getItem('user_role') === 'admin';
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// =============================================
// ROOMS APIs
// =============================================

export const roomsApi = {
  getAll: async (filters?: {
    category?: number;
    available?: boolean;
    min_price?: number;
    max_price?: number;
  }): Promise<ApiResponse<{ categories: RoomCategory[]; rooms: Room[] }>> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', String(filters.category));
    if (filters?.available !== undefined) params.append('available', String(filters.available));
    if (filters?.min_price) params.append('min_price', String(filters.min_price));
    if (filters?.max_price) params.append('max_price', String(filters.max_price));
    
    const queryString = params.toString();
    return apiRequest<{ categories: RoomCategory[]; rooms: Room[] }>(
      `/api/rooms${queryString ? `?${queryString}` : ''}`
    );
  },

  getById: async (roomId: number): Promise<ApiResponse<Room>> => {
    return apiRequest<Room>(`/api/rooms/${roomId}`);
  },
};

// =============================================
// BOOKINGS APIs
// =============================================

export const bookingsApi = {
  create: async (bookingData: BookingRequest): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>('/api/bookings/create', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
    return apiRequest<Booking[]>('/api/bookings/my');
  },
};

// =============================================
// SETTINGS API (Public)
// =============================================

export const settingsApi = {
  getPublic: async (): Promise<ApiResponse<Settings>> => {
    return apiRequest<Settings>('/api/settings/public');
  },
};

// =============================================
// ADMIN APIs
// =============================================

export const adminApi = {
  // Bookings
  getPendingBookings: async (): Promise<ApiResponse<Booking[]>> => {
    return apiRequest<Booking[]>('/api/admin/bookings/pending');
  },

  approveBooking: async (bookingId: string, action: 'approve' | 'reject', remarks?: string): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>('/api/admin/bookings/approve', {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId, action, remarks }),
    });
  },

  getAllBookings: async (params?: {
    booking_id?: string;
    date?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<Booking[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.booking_id) searchParams.append('booking_id', params.booking_id);
    if (params?.date) searchParams.append('date', params.date);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);
    
    return apiRequest<Booking[]>(`/api/admin/bookings?${searchParams.toString()}`);
  },

  searchBookings: async (params: {
    booking_id?: string;
    date?: string;
    status?: string;
  }): Promise<ApiResponse<Booking[]>> => {
    const searchParams = new URLSearchParams();
    if (params.booking_id) searchParams.append('booking_id', params.booking_id);
    if (params.date) searchParams.append('date', params.date);
    if (params.status) searchParams.append('status', params.status);
    
    return apiRequest<Booking[]>(`/api/admin/bookings?${searchParams.toString()}`);
  },

  updateBookingStatus: async (
    bookingId: string,
    bookingStatus: string,
    paymentStatus?: string,
    adminRemarks?: string
  ): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>(`/api/admin/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        booking_status: bookingStatus,
        payment_status: paymentStatus,
        admin_remarks: adminRemarks,
      }),
    });
  },

  deleteBooking: async (bookingId: string): Promise<ApiResponse<null>> => {
    return apiRequest(`/api/admin/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  },

  // Users
  getUsers: async (params?: {
    mobile?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ users: User[]; pagination: { current_page: number; total_pages: number; total_users: number } }>> => {
    const searchParams = new URLSearchParams();
    if (params?.mobile) searchParams.append('mobile', params.mobile);
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    
    return apiRequest(`/api/admin/users?${searchParams.toString()}`);
  },


  // Settings
  getSettings: async (): Promise<ApiResponse<Settings>> => {
    return apiRequest<Settings>('/api/admin/settings');
  },

  updateSettings: async (settings: Partial<Settings>): Promise<ApiResponse<Settings>> => {
    return apiRequest<Settings>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Rooms
  getRooms: async (): Promise<ApiResponse<Room[]>> => {
    return apiRequest<Room[]>('/api/admin/rooms');
  },

  createRoom: async (roomData: Partial<Room> & { facilities?: { name: string; icon?: string }[] }): Promise<ApiResponse<Room>> => {
    return apiRequest<Room>('/api/admin/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  updateRoom: async (roomId: number, roomData: Partial<Room>): Promise<ApiResponse<Room>> => {
    return apiRequest<Room>(`/api/admin/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  },

  deleteRoom: async (roomId: number): Promise<ApiResponse<null>> => {
    return apiRequest(`/api/admin/rooms/${roomId}`, {
      method: 'DELETE',
    });
  },

  // Categories
  getCategories: async (): Promise<ApiResponse<RoomCategory[]>> => {
    return apiRequest<RoomCategory[]>('/api/admin/categories');
  },

  updateCategory: async (categoryId: number, data: Partial<RoomCategory>): Promise<ApiResponse<RoomCategory>> => {
    return apiRequest<RoomCategory>(`/api/admin/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  createCategory: async (data: Omit<RoomCategory, 'category_id'>): Promise<ApiResponse<RoomCategory>> => {
    return apiRequest<RoomCategory>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Dashboard
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    return apiRequest('/api/admin/dashboard');
  },

  // Users
  getUsers: async (params?: {
    mobile?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ users: User[]; pagination: any }>> => {
    const searchParams = new URLSearchParams();
    if (params?.mobile) searchParams.append('mobile', params.mobile);
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    
    return apiRequest(`/api/admin/users?${searchParams.toString()}`);
  },

  getUserDetails: async (userId: number): Promise<ApiResponse<{ user: User; bookings: Booking[] }>> => {
    return apiRequest(`/api/admin/users/${userId}`);
  },

  updateUser: async (userId: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiRequest<User>(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId: number): Promise<ApiResponse<null>> => {
    return apiRequest(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Categories
  getCategories: async (): Promise<ApiResponse<RoomCategory[]>> => {
    return apiRequest<RoomCategory[]>('/api/admin/categories');
  },

  createCategory: async (data: Partial<RoomCategory>): Promise<ApiResponse<RoomCategory>> => {
    return apiRequest<RoomCategory>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCategory: async (categoryId: number, data: Partial<RoomCategory>): Promise<ApiResponse<RoomCategory>> => {
    return apiRequest<RoomCategory>(`/api/admin/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCategory: async (categoryId: number): Promise<ApiResponse<null>> => {
    return apiRequest(`/api/admin/categories/${categoryId}`, {
      method: 'DELETE',
    });
  },

  // Settings
  getSettings: async (): Promise<ApiResponse<Settings>> => {
    return apiRequest<Settings>('/api/admin/settings');
  },

  updateSettings: async (settings: Partial<Settings>): Promise<ApiResponse<Settings>> => {
    return apiRequest<Settings>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Reports
  getBookingReport: async (startDate: string, endDate: string, format?: 'json' | 'csv'): Promise<ApiResponse<{
    summary: {
      total_bookings: number;
      confirmed: number;
      pending: number;
      cancelled: number;
      total_revenue: number;
    };
    bookings: Booking[];
  }>> => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });
    if (format) params.append('format', format);
    
    return apiRequest(`/api/admin/reports/bookings?${params.toString()}`);
  },
};

export default {
  auth: authApi,
  rooms: roomsApi,
  bookings: bookingsApi,
  settings: settingsApi,
  admin: adminApi,
};
