import { create } from "zustand";
import { cartApi } from "@/lib/shop-client-api";
import type { Cart } from "@/types/shop";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  setCart: (cart: Cart) => void;
  refresh: () => Promise<void>;
  clear: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  cart: null,
  isLoading: false,
  setCart: (cart) => set({ cart }),
  clear: () => set({ cart: null }),
  refresh: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartApi.get();
      set({ cart });
    } catch {
      set({ cart: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const cartItemCount = (cart: Cart | null) =>
  cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
