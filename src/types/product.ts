export interface Product {
  id: string;
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
  description?: string;
  priceCents: number;
  stock?: number;
  imageUrl?: string;
}
