"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import { ordersApi } from "@/lib/shop-client-api";
import type { Order } from "@/types/shop";

const statusLabels: Record<Order["status"], string> = {
  pending: "قيد الانتظار",
  paid: "مدفوع",
  cancelled: "ملغي",
};

export function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    ordersApi
      .list()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  if (!orders) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <Receipt className="size-10 text-muted-foreground" />
        <p className="font-medium">لا توجد طلبات بعد</p>
        <Button asChild className="mt-2">
          <Link href="/products">ابدأ التسوق</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <Link key={order.id} href={`/orders/${order.id}`}>
          <Card className="transition-colors hover:border-primary/40">
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium">طلب #{order.id.slice(0, 8)}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={order.status === "paid" ? "secondary" : "outline"}>
                  {statusLabels[order.status]}
                </Badge>
                <span className="font-semibold">{formatPrice(order.totalCents)}</span>
                <ChevronLeft className="size-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
