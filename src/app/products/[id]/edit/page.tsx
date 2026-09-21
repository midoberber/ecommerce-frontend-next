import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/product-form";
import { getCategories, getProduct } from "@/lib/products-api";
import { getSession } from "@/lib/server-api";

export const metadata: Metadata = { title: "تعديل المنتج" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, user] = await Promise.all([
    getProduct(id),
    getCategories(),
    getSession(),
  ]);

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <ShieldAlert className="size-12 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">هذه الصفحة للمديرين فقط</h1>
        <Button asChild className="mt-2">
          <Link href="/products">العودة للمنتجات</Link>
        </Button>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductForm categories={categories} product={product} />;
}
