import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CreditCard, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/product-image";
import { CancelOrderButton } from "@/components/cancel-order-button";
import { formatPrice } from "@/lib/format";
import { orderStatusLabels, orderStatusVariants } from "@/lib/order-status";
import { getServerOrder } from "@/lib/server-api";

export const metadata: Metadata = { title: "تفاصيل الطلب" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getServerOrder(id);

  if (!order) {
    notFound();
  }

  const needsPayment = order.status === "pending" || order.status === "failed";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
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
              <Badge variant={orderStatusVariants[order.status]}>
                {orderStatusLabels[order.status]}
              </Badge>
            </div>

            {needsPayment && (
              <div className="flex flex-wrap items-center gap-2">
                <Button asChild>
                  <Link href={`/orders/${order.id}/pay`}>
                    <CreditCard data-icon="inline-start" />
                    إتمام الدفع
                  </Link>
                </Button>
                <CancelOrderButton orderId={order.id} />
              </div>
            )}

            <Separator />

            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <ProductImage
                    src={item.imageUrl}
                    alt={item.productName}
                    className="size-14 shrink-0 rounded-lg"
                  />
                  <div className="flex flex-1 flex-col">
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

            {order.shippingAddress && (
              <>
                <Separator />
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium">عنوان الشحن</p>
                    <p className="text-muted-foreground">{order.shippingAddress}</p>
                  </div>
                </div>
              </>
            )}

            {order.status === "paid" && order.cardLast4 && (
              <div className="flex items-start gap-2 text-sm">
                <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">تم الدفع ببطاقة تنتهي بـ {order.cardLast4}</p>
                  <p className="text-muted-foreground" dir="ltr">
                    {order.paymentReference}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
