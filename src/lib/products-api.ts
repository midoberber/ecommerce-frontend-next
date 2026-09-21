import type { Product, ProductFilters } from "@/types/product";
import type { Category } from "@/types/shop";
import type { Review } from "@/types/review";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const url = new URL("/products", API_URL);

  Object.entries(filters).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load products");
  }
  return res.json();
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error("Failed to load product");
  }
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load categories");
  }
  return res.json();
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const res = await fetch(`${API_URL}/products/${productId}/reviews`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
