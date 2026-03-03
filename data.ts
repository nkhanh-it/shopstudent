import { Product, User, UserRole, Order, OrderStatus } from './types';

// Mock Users
// Fix: Use string IDs for users as defined in types.ts
export const MOCK_USERS: User[] = [
  { id: '1', name: 'Nguyễn Văn Admin', email: 'admin@shop.com', role: UserRole.ADMIN, avatar: 'https://i.pravatar.cc/150?u=admin' },
  { id: '2', name: 'Trần Sinh Viên', email: 'user@shop.com', role: UserRole.USER, avatar: 'https://i.pravatar.cc/150?u=student' }
];

// Mock Products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Laptop Gaming ASUS ROG",
    description: "Laptop chơi game hiệu năng cao, RTX 4060, i7 13th Gen.",
    price: 25000000,
    category: "Laptop",
    image: "https://picsum.photos/id/1/600/600",
    stock: 10,
    rating: 4.8
  },
  {
    id: 2,
    name: "MacBook Air M2",
    description: "Siêu mỏng nhẹ, pin trâu, phù hợp sinh viên kinh tế.",
    price: 28000000,
    category: "Laptop",
    image: "https://picsum.photos/id/119/600/600",
    stock: 5,
    rating: 4.9
  },
  {
    id: 3,
    name: "Tai nghe Sony WH-1000XM5",
    description: "Chống ồn chủ động đỉnh cao, âm thanh chi tiết.",
    price: 8500000,
    category: "Audio",
    image: "https://picsum.photos/id/145/600/600",
    stock: 20,
    rating: 4.7
  },
  {
    id: 4,
    name: "Bàn phím cơ Keychron K2",
    description: "Gõ sướng tay, led RGB, kết nối 3 thiết bị.",
    price: 1800000,
    category: "Accessories",
    image: "https://picsum.photos/id/366/600/600",
    stock: 15,
    rating: 4.6
  },
  {
    id: 5,
    name: "Chuột Logitech MX Master 3S",
    description: "Chuột công thái học tốt nhất cho công việc.",
    price: 2200000,
    category: "Accessories",
    image: "https://picsum.photos/id/250/600/600",
    stock: 30,
    rating: 4.9
  },
  {
    id: 6,
    name: "Màn hình Dell UltraSharp 27",
    description: "Màu sắc chuẩn đồ họa, 4K, USB-C.",
    price: 12000000,
    category: "Monitor",
    image: "https://picsum.photos/id/48/600/600",
    stock: 8,
    rating: 4.8
  },
  {
    id: 7,
    name: "Ba lô chống sốc",
    description: "Chống nước, nhiều ngăn, bảo vệ laptop.",
    price: 450000,
    category: "Accessories",
    image: "https://picsum.photos/id/103/600/600",
    stock: 100,
    rating: 4.5
  },
  {
    id: 8,
    name: "iPad Air 5 M1",
    description: "Học tập, giải trí, vẽ vời cực đỉnh.",
    price: 14500000,
    category: "Tablet",
    image: "https://picsum.photos/id/6/600/600",
    stock: 12,
    rating: 4.8
  }
];

// Mock Orders
// Fix: Ensure MOCK_ORDERS matches the Order interface structure and uses string IDs
export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', userId: '2', customerName: 'Trần Sinh Viên', totalAmount: 26800000, status: OrderStatus.COMPLETED, date: '2023-10-01', itemsCount: 2, items: [], paymentMethod: 'VNPAY', trackingNumber: 'VNP123456', shippingAddress: 'Hà Nội' },
  { id: 'ORD-002', userId: '2', customerName: 'Trần Sinh Viên', totalAmount: 450000, status: OrderStatus.SHIPPING, date: '2023-10-05', itemsCount: 1, items: [], paymentMethod: 'COD', trackingNumber: 'COD987654', shippingAddress: 'Hồ Chí Minh' },
  { id: 'ORD-003', userId: '3', customerName: 'Lê Khách Hàng', totalAmount: 8500000, status: OrderStatus.PENDING, date: '2023-10-06', itemsCount: 1, items: [], paymentMethod: 'VNPAY', trackingNumber: 'VNP112233', shippingAddress: 'Đà Nẵng' },
  { id: 'ORD-004', userId: '4', customerName: 'Phạm Người Dùng', totalAmount: 12000000, status: OrderStatus.CANCELLED, date: '2023-09-28', itemsCount: 1, items: [], paymentMethod: 'COD', trackingNumber: 'CAN000000', shippingAddress: 'Hải Phòng' },
  { id: 'ORD-005', userId: '2', customerName: 'Trần Sinh Viên', totalAmount: 2200000, status: OrderStatus.PENDING, date: '2023-10-07', itemsCount: 1, items: [], paymentMethod: 'COD', trackingNumber: 'COD445566', shippingAddress: 'Cần Thơ' },
];