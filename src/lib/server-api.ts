import "server-only";
import { getSessionToken } from "./auth-cookie";
import type { Address } from "@/types/address";
import type { AuthUser } from "@/types/auth";
import type { Cart, Order, OrderDetail } from "@/types/shop";

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
