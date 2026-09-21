import type { OrderStatus } from "@/types/shop";

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "بانتظار الدفع",
  paid: "مدفوع",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
  failed: "فشل الدفع",
};

export const orderStatusVariants: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  paid: "secondary",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
  failed: "destructive",
};
