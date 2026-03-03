
// Enum for User Roles
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

// Address Model
export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  isDefault?: boolean;
}

// User Model (Matches DB: users table)
export interface User {
  id: string; // Changed to string to match Firebase UID
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  savedAddresses?: Address[];
}

// Product Model (Matches DB: products table)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
}

// Cart Item
export interface CartItem extends Product {
  quantity: number;
}

// Order Status Enum
export enum OrderStatus {
  PENDING = 'Chờ xử lý',
  SHIPPING = 'Đang giao',
  COMPLETED = 'Hoàn thành',
  CANCELLED = 'Đã hủy'
}

// Order Model (Matches DB: orders table)
export interface Order {
  id: string;
  userId: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  date: string;
  itemsCount: number;
  items: CartItem[]; // Detailed list for history
  paymentMethod: string;
  trackingNumber: string;
  shippingAddress: string;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}
