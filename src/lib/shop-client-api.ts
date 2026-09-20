import { apiClient } from "./api-client";
import type { Category } from "@/types/shop";
import type { Cart, Order, OrderDetail } from "@/types/shop";

export const cartApi = {
  get: () => apiClient.get<Cart>("/cart").then((res) => res.data),

  addItem: (productId: string, quantity: number) =>
    apiClient.post<Cart>("/cart/items", { productId, quantity }).then((res) => res.data),

  updateItem: (itemId: string, quantity: number) =>
    apiClient.patch<Cart>(`/cart/items/${itemId}`, { quantity }).then((res) => res.data),

  removeItem: (itemId: string) =>
    apiClient.delete<Cart>(`/cart/items/${itemId}`).then((res) => res.data),
};

export const ordersApi = {
  checkout: () => apiClient.post<Order>("/orders").then((res) => res.data),

  list: () => apiClient.get<Order[]>("/orders").then((res) => res.data),

  get: (id: string) => apiClient.get<OrderDetail>(`/orders/${id}`).then((res) => res.data),
};

export const categoriesApi = {
  list: () => apiClient.get<Category[]>("/categories").then((res) => res.data),
};
