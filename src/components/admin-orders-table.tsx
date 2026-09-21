"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import { orderStatusLabels, orderStatusVariants } from "@/lib/order-status";
import { adminApi } from "@/lib/shop-client-api";
import { ADMIN_ORDER_STATUSES, type AdminOrder, type AdminOrderStatus } from "@/types/admin";

export function AdminOrdersTable({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const changeStatus = async (orderId: string, status: AdminOrderStatus) => {
    setPendingId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, status);
      toast.success(`تم تحديث الحالة إلى: ${orderStatusLabels[status]}`);
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر تحديث الحالة"));
    } finally {
      setPendingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <Receipt className="size-10 text-muted-foreground" />
        <p className="font-medium">لا توجد طلبات</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">{orders.length} طلب</p>

      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/orders/${order.id}`} className="font-medium hover:underline">
                  طلب #{order.id.slice(0, 8)}
                </Link>
                <Badge variant={orderStatusVariants[order.status]}>
                  {orderStatusLabels[order.status]}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {order.customerName} · {order.customerEmail}
              </span>
              <span className="text-xs text-muted-foreground">
                {order.itemCount} قطعة ·{" "}
                {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {order.shippingAddress && (
                <span className="truncate text-xs text-muted-foreground">
                  {order.shippingAddress}
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="font-semibold">{formatPrice(order.totalCents)}</span>
              {pendingId === order.id ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : (
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    changeStatus(order.id, value as AdminOrderStatus)
                  }
                >
                  <SelectTrigger size="sm" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {order.status === "pending" && (
                      <SelectItem value="pending" disabled>
                        بانتظار الدفع
                      </SelectItem>
                    )}
                    {order.status === "failed" && (
                      <SelectItem value="failed" disabled>
                        فشل الدفع
                      </SelectItem>
                    )}
                    {ADMIN_ORDER_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {orderStatusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
