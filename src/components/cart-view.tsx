"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/product-image";
import { formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import { cartApi, ordersApi } from "@/lib/shop-client-api";
import { useCartStore } from "@/store/cart-store";
import type { Cart } from "@/types/shop";

export function CartView({ initialCart }: { initialCart: Cart | null }) {
  const router = useRouter();
  const cart = useCartStore((s) => s.cart);
  const setCart = useCartStore((s) => s.setCart);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (initialCart) {
      setCart(initialCart);
    }
  }, [initialCart, setCart]);

  const changeQuantity = async (itemId: string, quantity: number) => {
    setPendingId(itemId);
    try {
      setCart(await cartApi.updateItem(itemId, quantity));
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر تحديث الكمية"));
    } finally {
      setPendingId(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setPendingId(itemId);
    try {
      setCart(await cartApi.removeItem(itemId));
      toast.success("تم حذف المنتج");
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر حذف المنتج"));
    } finally {
      setPendingId(null);
    }
  };

  const checkout = async () => {
    setIsCheckingOut(true);
    try {
      const order = await ordersApi.checkout();
      setCart({ items: [], totalCents: 0 });
      toast.success("تم إنشاء طلبك بنجاح");
      router.push(`/orders/${order.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر إتمام الطلب"));
    } finally {
      setIsCheckingOut(false);
    }
  };

  const current = cart ?? initialCart;

  if (!current || current.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <p className="font-medium">سلتك فارغة</p>
        <Button asChild className="mt-2">
          <Link href="/products">تصفح المنتجات</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-3">
        {current.items.map((item) => {
          const busy = pendingId === item.id;
          return (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-4">
                <ProductImage
                  src={item.imageUrl}
                  alt={item.name}
                  className="size-20 shrink-0 rounded-lg"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link href={`/products/${item.productId}`} className="truncate font-medium">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.priceCents)} للقطعة
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={busy || item.quantity <= 1}
                      onClick={() => changeQuantity(item.id, item.quantity - 1)}
                      aria-label="إنقاص الكمية"
                    >
                      <Minus />
                    </Button>
                    <span className="w-10 text-center tabular-nums">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={busy || item.quantity >= item.stock}
                      onClick={() => changeQuantity(item.id, item.quantity + 1)}
                      aria-label="زيادة الكمية"
                    >
                      <Plus />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="ms-2 text-destructive"
                      disabled={busy}
                      onClick={() => removeItem(item.id)}
                      aria-label="حذف المنتج"
                    >
                      {busy ? <Loader2 className="animate-spin" /> : <Trash2 />}
                    </Button>
                  </div>
                </div>
                <p className="shrink-0 font-semibold">
                  {formatPrice(item.priceCents * item.quantity)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="h-fit lg:sticky lg:top-20">
        <CardContent className="flex flex-col gap-3">
          <h2 className="font-semibold">ملخص الطلب</h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>عدد القطع</span>
            <span>{current.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>الإجمالي</span>
            <span>{formatPrice(current.totalCents)}</span>
          </div>
          <Button size="lg" className="mt-2" onClick={checkout} disabled={isCheckingOut}>
            {isCheckingOut && <Loader2 className="animate-spin" />}
            إتمام الطلب
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
