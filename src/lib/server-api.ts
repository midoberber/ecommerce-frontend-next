import "server-only";
import { getSessionToken } from "./auth-cookie";
import type { Address } from "@/types/address";
import type { AuthUser } from "@/types/auth";
import type { Cart, Order, OrderDetail } from "@/types/shop";
import type { Product } from "@/types/product";
import type { AdminOrder, AdminStats, AdminUser } from "@/types/admin";
import type { MyReviewState } from "@/types/review";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function authedFetch(path: string) {
  const token = await getSessionToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export function getSession(): Promise<AuthUser | null> {
  return authedFetch("/auth/me");
}

export function getServerCart(): Promise<Cart | null> {
  return authedFetch("/cart");
}

export function getServerOrders(): Promise<Order[] | null> {
  return authedFetch("/orders");
}

export function getServerOrder(id: string): Promise<OrderDetail | null> {
  return authedFetch(`/orders/${id}`);
}

export function getServerAddresses(): Promise<Address[] | null> {
  return authedFetch("/addresses");
}

export function getServerWishlist(): Promise<Product[] | null> {
  return authedFetch("/wishlist");
}

export function getServerWishlistIds(): Promise<string[] | null> {
  return authedFetch("/wishlist/ids");
}

export function getServerAdminStats(): Promise<AdminStats | null> {
  return authedFetch("/admin/stats");
}

export function getServerAdminOrders(): Promise<AdminOrder[] | null> {
  return authedFetch("/admin/orders");
}

export function getServerMyReview(productId: string): Promise<MyReviewState | null> {
  return authedFetch(`/products/${productId}/reviews/me`);
}

export function getServerAdminUsers(): Promise<AdminUser[] | null> {
  return authedFetch("/admin/users");
}
