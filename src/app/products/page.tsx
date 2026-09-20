import type { Metadata } from "next";
import Link from "next/link";
import { PackageOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CategoryFilter } from "@/components/category-filter";
import { getCategories, getProducts } from "@/lib/products-api";

export const metadata: Metadata = { title: "المنتجات" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { categoryId } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(categoryId), getCategories()]);

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

      <CategoryFilter categories={categories} activeId={categoryId} />

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <PackageOpen className="size-10 text-muted-foreground" />
          <p className="font-medium">لا توجد منتجات هنا</p>
          <p className="text-sm text-muted-foreground">جرّب فئة أخرى أو أضف منتجاً جديداً.</p>
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
