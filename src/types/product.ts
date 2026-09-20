export interface Product {
  id: string;
  categoryId: string | null;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  categoryId?: string;
  description?: string;
  priceCents: number;
  stock?: number;
  imageUrl?: string;
}
