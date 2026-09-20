export type UserRole = "customer" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  avatarUrl?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
