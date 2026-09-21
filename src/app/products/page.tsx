import type { Metadata } from "next";
import Link from "next/link";
import { PackageOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ProductListItem } from "@/components/product-list-item";
import { ProductFilters } from "@/components/product-filters";
import { ViewToggle } from "@/components/view-toggle";
import { getCategories, getProducts } from "@/lib/products-api";
import { getServerWishlistIds, getSession } from "@/lib/server-api";
import type { ProductFilters as Filters, ProductView } from "@/types/product";

export const metadata: Metadata = { title: "المنتجات" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Filters & { view?: ProductView }>;
}) {
  const { view, ...filters } = await searchParams;
  const activeView: ProductView = view === "list" ? "list" : "grid";

  const [products, categories, user, wishlistIds] = await Promise.all([
    getProducts(filters),
    getCategories(),
    getSession(),
    getServerWishlistIds(),
  ]);
  const isAdmin = user?.role === "admin";
  const wishlist = new Set(wishlistIds ?? []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">المنتجات</h1>
          <p className="text-sm text-muted-foreground">{products.length} منتج</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle view={activeView} />
          {isAdmin && (
            <Button asChild>
              <Link href="/products/new">
                <Plus data-icon="inline-start" />
                منتج جديد
              </Link>
            </Button>
          )}
        </div>
      </div>

      <ProductFilters categories={categories} />

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <PackageOpen className="size-10 text-muted-foreground" />
          <p className="font-medium">لا توجد منتجات مطابقة</p>
          <p className="text-sm text-muted-foreground">جرّب تعديل الفلاتر أو البحث بكلمة أخرى.</p>
        </div>
      ) : activeView === "list" ? (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              inWishlist={wishlist.has(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inWishlist={wishlist.has(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
