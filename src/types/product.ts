export interface Product {
  id: string;
  categoryId: string | null;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  categoryId?: string;
  description?: string;
  priceCents: number;
  stock?: number;
  images?: string[];
}

export const PRODUCT_SORTS = ["newest", "price_asc", "price_desc", "name"] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

export type ProductView = "grid" | "list";

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: ProductSort;
}
