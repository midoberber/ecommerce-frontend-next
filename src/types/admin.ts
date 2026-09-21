import type { OrderStatus } from "./shop";

export interface AdminStats {
  products: number;
  outOfStock: number;
  users: number;
  orders: number;
  pendingOrders: number;
  reviews: number;
  revenueCents: number;
  topProducts: { productId: string | null; name: string; soldQuantity: number }[];
  salesTrend: { date: string; revenueCents: number; orderCount: number }[];
  ordersByStatus: { status: OrderStatus; count: number }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  isBlocked: boolean;
  avatarUrl: string | null;
  createdAt: string;
  orderCount: number;
  totalSpentCents: string;
}

export interface AdminOrder {
  id: string;
  totalCents: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string | null;
  customerName: string;
  customerEmail: string;
  itemCount: string;
}

export const ADMIN_ORDER_STATUSES = ["paid", "shipped", "delivered", "cancelled"] as const;
export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];
