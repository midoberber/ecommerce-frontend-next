import { apiClient } from './api-client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/auth/register', payload).then((res) => res.data),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', payload).then((res) => res.data),
};
