import axios from "axios";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/types/auth";

export const authApi = {
  register: (payload: RegisterPayload) =>
    axios.post<{ user: AuthUser }>("/api/auth/register", payload).then((res) => res.data),

  login: (payload: LoginPayload) =>
    axios.post<{ user: AuthUser }>("/api/auth/login", payload).then((res) => res.data),

  logout: () => axios.post("/api/auth/logout"),
};
