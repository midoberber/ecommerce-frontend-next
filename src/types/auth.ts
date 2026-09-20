export type UserRole = "customer" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
