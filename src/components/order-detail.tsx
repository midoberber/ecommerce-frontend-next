"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import { ordersApi } from "@/lib/shop-client-api";
import type { OrderDetail as OrderDetailType } from "@/types/shop";

export function OrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    ordersApi
      .get(orderId)
      .then(setOrder)
      .catch(() => setNotFound(true));
  }, [orderId]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="font-medium">الطلب غير موجود</p>
        <Button asChild>
          <Link href="/orders">كل الطلبات</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" asChild className="self-start">
        <Link href="/orders">
          <ArrowRight data-icon="inline-start" />
          كل الطلبات
        </Link>
      </Button>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold">طلب #{order.id.slice(0, 8)}</h1>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleString("ar-EG")}
              </p>
            </div>
            <Badge variant="secondary">
              <CircleCheck className="size-3.5" />
              مدفوع
            </Badge>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatPrice(item.unitPriceCents)} × {item.quantity}
                  </span>
                </div>
                <span className="font-medium">
                  {formatPrice(item.unitPriceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between text-lg font-semibold">
            <span>الإجمالي</span>
            <span>{formatPrice(order.totalCents)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
