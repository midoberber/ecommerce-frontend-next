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

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed";

export interface Order {
  id: string;
  userId: string;
  totalCents: number;
  status: OrderStatus;
  shippingAddress: string | null;
  paymentReference: string | null;
  cardLast4: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  imageUrl: string | null;
  unitPriceCents: number;
  quantity: number;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export interface PayOrderPayload {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvc: string;
}
