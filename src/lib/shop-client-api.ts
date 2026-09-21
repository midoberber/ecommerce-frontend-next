import axios from "axios";
import { apiClient } from "./api-client";
import type { Address, AddressPayload } from "@/types/address";
import type { AuthUser, UpdateProfilePayload } from "@/types/auth";
import type { CreateProductPayload, Product } from "@/types/product";
import type { Cart, Category, Order, OrderDetail, PayOrderPayload } from "@/types/shop";
import type { CreateReviewPayload, MyReviewState, Review } from "@/types/review";
import type { AdminOrderStatus } from "@/types/admin";

export const productsApi = {
  create: (payload: CreateProductPayload) =>
    apiClient.post<Product>("/products", payload).then((res) => res.data),
};

export const cartApi = {
  get: () => apiClient.get<Cart>("/cart").then((res) => res.data),

  addItem: (productId: string, quantity: number) =>
    apiClient.post<Cart>("/cart/items", { productId, quantity }).then((res) => res.data),

  updateItem: (itemId: string, quantity: number) =>
    apiClient.patch<Cart>(`/cart/items/${itemId}`, { quantity }).then((res) => res.data),

  removeItem: (itemId: string) =>
    apiClient.delete<Cart>(`/cart/items/${itemId}`).then((res) => res.data),
};

export const addressesApi = {
  list: () => apiClient.get<Address[]>("/addresses").then((res) => res.data),

  create: (payload: AddressPayload) =>
    apiClient.post<Address>("/addresses", payload).then((res) => res.data),

  update: (id: string, payload: Partial<AddressPayload>) =>
    apiClient.patch<Address>(`/addresses/${id}`, payload).then((res) => res.data),

  setDefault: (id: string) =>
    apiClient.post<Address>(`/addresses/${id}/default`).then((res) => res.data),

  remove: (id: string) => apiClient.delete(`/addresses/${id}`),
};

export const ordersApi = {
  checkout: (addressId: string) =>
    apiClient.post<Order>("/orders", { addressId }).then((res) => res.data),

  pay: (orderId: string, payload: PayOrderPayload) =>
    apiClient.post<Order>(`/orders/${orderId}/pay`, payload).then((res) => res.data),

  cancel: (orderId: string) =>
    apiClient.post<Order>(`/orders/${orderId}/cancel`).then((res) => res.data),

  get: (id: string) => apiClient.get<OrderDetail>(`/orders/${id}`).then((res) => res.data),
};

export const categoriesApi = {
  list: () => apiClient.get<Category[]>("/categories").then((res) => res.data),
};

export const profileApi = {
  update: (payload: UpdateProfilePayload) =>
    apiClient.patch<AuthUser>("/users/me", payload).then((res) => res.data),
};

export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await axios.post<{ urls: string[] }>("/api/upload", formData);
  return res.data.urls;
}

export const wishlistApi = {
  add: (productId: string) =>
    apiClient.post<{ productId: string; inWishlist: boolean }>(`/wishlist/${productId}`),

  remove: (productId: string) =>
    apiClient.delete<{ productId: string; inWishlist: boolean }>(`/wishlist/${productId}`),
};

export const reviewsApi = {
  listByProduct: (productId: string) =>
    apiClient.get<Review[]>(`/products/${productId}/reviews`).then((res) => res.data),

  mine: (productId: string) =>
    apiClient.get<MyReviewState>(`/products/${productId}/reviews/me`).then((res) => res.data),

  submit: (productId: string, payload: CreateReviewPayload) =>
    apiClient.post(`/products/${productId}/reviews`, payload).then((res) => res.data),

  remove: (reviewId: string) => apiClient.delete(`/reviews/${reviewId}`),
};

export const adminApi = {
  updateOrderStatus: (orderId: string, status: AdminOrderStatus) =>
    apiClient.patch(`/admin/orders/${orderId}/status`, { status }).then((res) => res.data),

  deleteProduct: (productId: string) => apiClient.delete(`/products/${productId}`),

  updateProduct: (productId: string, payload: Partial<CreateProductPayload>) =>
    apiClient.patch<Product>(`/products/${productId}`, payload).then((res) => res.data),

  setUserBlocked: (userId: string, isBlocked: boolean) =>
    apiClient.patch(`/admin/users/${userId}/block`, { isBlocked }).then((res) => res.data),
};
