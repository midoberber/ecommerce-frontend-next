import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { orderStatusLabels, orderStatusVariants } from "@/lib/order-status";
import { getServerOrders } from "@/lib/server-api";

export const metadata: Metadata = { title: "طلباتي" };

export default async function OrdersPage() {
  const orders = (await getServerOrders()) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">طلباتي</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <Receipt className="size-10 text-muted-foreground" />
          <p className="font-medium">لا توجد طلبات بعد</p>
          <Button asChild className="mt-2">
            <Link href="/products">ابدأ التسوق</Link>
          </Button>
        </div>
      ) : (
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
                    <Badge variant={orderStatusVariants[order.status]}>
                      {orderStatusLabels[order.status]}
                    </Badge>
                    <span className="font-semibold">{formatPrice(order.totalCents)}</span>
                    <ChevronLeft className="size-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
