import { apiClient } from './api-client';
import type { CreateProductPayload, Product } from '@/types/product';

export const productsClientApi = {
  create: (payload: CreateProductPayload) =>
    apiClient.post<Product>('/products', payload).then((res) => res.data),
};
