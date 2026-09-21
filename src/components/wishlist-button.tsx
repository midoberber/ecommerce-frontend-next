"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/session-provider";
import { getErrorMessage } from "@/lib/errors";
import { wishlistApi } from "@/lib/shop-client-api";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  initialInWishlist,
  variant = "icon",
}: {
  productId: string;
  initialInWishlist: boolean;
  variant?: "icon" | "full";
}) {
  const router = useRouter();
  const user = useSession();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [isPending, setIsPending] = useState(false);

  const toggle = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      toast.info("سجّل الدخول لحفظ المنتجات في المفضلة");
      router.push("/login");
      return;
    }

    const next = !inWishlist;
    setInWishlist(next);
    setIsPending(true);

    try {
      if (next) {
        await wishlistApi.add(productId);
        toast.success("تمت الإضافة للمفضلة");
      } else {
        await wishlistApi.remove(productId);
        toast.success("تمت الإزالة من المفضلة");
      }
      router.refresh();
    } catch (err) {
      setInWishlist(!next);
      toast.error(getErrorMessage(err, "تعذّر تحديث المفضلة"));
    } finally {
      setIsPending(false);
    }
  };

  const heart = (
    <Heart className={cn(inWishlist && "fill-destructive text-destructive")} />
  );

  if (variant === "full") {
    return (
      <Button variant="outline" size="lg" onClick={toggle} disabled={isPending}>
        {heart}
        {inWishlist ? "في المفضلة" : "أضف للمفضلة"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      disabled={isPending}
      aria-label={inWishlist ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      className="bg-background/80 backdrop-blur hover:bg-background"
    >
      {heart}
    </Button>
  );
}
