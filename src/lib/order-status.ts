import type { OrderStatus } from "@/types/shop";

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "بانتظار الدفع",
  paid: "مدفوع",
  cancelled: "ملغي",
  failed: "فشل الدفع",
};

export const orderStatusVariants: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  paid: "secondary",
  cancelled: "destructive",
  failed: "destructive",
};
