import { RowDataPacket } from 'mysql2';

export const formatResponse = <T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
): { success: boolean; message?: string; error?: string; data?: T } => {
  const response: any = { success };
  if (message) response.message = message;
  if (error) response.error = error;
  if (data !== undefined) response.data = data;
  return response;
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const generateBookingId = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TSN${dateStr}${random}`;
};

export const parseRowData = <T>(rows: RowDataPacket[]): T[] => {
  return rows as T[];
};

export const parseSingleRow = <T>(rows: RowDataPacket[]): T | null => {
  return rows.length > 0 ? (rows[0] as T) : null;
};

