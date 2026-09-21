import type { Metadata } from "next";
import Link from "next/link";
import { HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { getServerWishlist } from "@/lib/server-api";

export const metadata: Metadata = { title: "المفضلة" };

export default async function WishlistPage() {
  const products = (await getServerWishlist()) ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">المفضلة</h1>
        <p className="text-sm text-muted-foreground">{products.length} منتج</p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <HeartOff className="size-10 text-muted-foreground" />
          <p className="font-medium">قائمة المفضلة فارغة</p>
          <p className="text-sm text-muted-foreground">
            اضغط على القلب في أي منتج لحفظه هنا.
          </p>
          <Button asChild className="mt-2">
            <Link href="/products">تصفح المنتجات</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} inWishlist />
          ))}
        </div>
      )}
    </div>
  );
}
