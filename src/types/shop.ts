export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  totalCents: number;
}

export type OrderStatus = "pending" | "paid" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  totalCents: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  unitPriceCents: number;
  quantity: number;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}
