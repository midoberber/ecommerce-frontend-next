import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/product-image";
import { formatPrice } from "@/lib/format";
import { getProduct } from "@/lib/products-api";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.name ?? "منتج غير موجود" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const outOfStock = product.stock === 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/products">
          <ArrowRight data-icon="inline-start" />
          رجوع للمنتجات
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="rounded-xl border"
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {outOfStock ? (
              <Badge variant="destructive">نفد المخزون</Badge>
            ) : (
              <Badge variant="secondary">متوفر: {product.stock}</Badge>
            )}
          </div>

          <p className="text-3xl font-semibold">{formatPrice(product.priceCents)}</p>

          <Separator />

          <div>
            <h2 className="mb-2 font-medium">الوصف</h2>
            <p className="leading-7 text-muted-foreground">
              {product.description || "لا يوجد وصف لهذا المنتج."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
