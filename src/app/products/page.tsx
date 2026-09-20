import type { Metadata } from "next";
import Link from "next/link";
import { PackageOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/products-api";

export const metadata: Metadata = { title: "المنتجات" };

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">المنتجات</h1>
          <p className="text-sm text-muted-foreground">{products.length} منتج</p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus data-icon="inline-start" />
            منتج جديد
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <PackageOpen className="size-10 text-muted-foreground" />
          <p className="font-medium">لا توجد منتجات بعد</p>
          <p className="text-sm text-muted-foreground">ابدأ بإضافة أول منتج للمتجر.</p>
          <Button asChild className="mt-2">
            <Link href="/products/new">إضافة منتج</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
