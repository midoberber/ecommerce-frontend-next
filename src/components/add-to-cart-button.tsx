"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/components/session-provider";
import { getErrorMessage } from "@/lib/errors";
import { cartApi } from "@/lib/shop-client-api";
import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({ productId, stock }: { productId: string; stock: number }) {
  const router = useRouter();
  const user = useSession();
  const setCart = useCartStore((s) => s.setCart);
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      toast.info("سجّل الدخول أولاً لإضافة المنتجات للسلة");
      router.push("/login");
      return;
    }

    setIsPending(true);
    try {
      const cart = await cartApi.addItem(productId, quantity);
      setCart(cart);
      toast.success("تمت الإضافة إلى السلة");
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر إضافة المنتج"));
    } finally {
      setIsPending(false);
    }
  };

  if (stock === 0) {
    return (
      <Button disabled size="lg">
        غير متوفر حالياً
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min={1}
        max={stock}
        dir="ltr"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Math.min(stock, Number(e.target.value) || 1)))}
        className="w-20"
        aria-label="الكمية"
      />
      <Button size="lg" onClick={handleAdd} disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
        أضف إلى السلة
      </Button>
    </div>
  );
}
