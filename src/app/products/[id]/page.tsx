import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";
import { StarRating } from "@/components/star-rating";
import { ProductReviews } from "@/components/product-reviews";
import { formatPrice } from "@/lib/format";
import { getProduct, getProductReviews } from "@/lib/products-api";
import { getServerMyReview, getServerWishlistIds, getSession } from "@/lib/server-api";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.name ?? "منتج غير موجود" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const [product, user, wishlistIds, reviews, myReview] = await Promise.all([
    getProduct(id),
    getSession(),
    getServerWishlistIds(),
    getProductReviews(id),
    getServerMyReview(id),
  ]);

  if (!product) {
    notFound();
  }

  const outOfStock = product.stock === 0;
  const inWishlist = (wishlistIds ?? []).includes(product.id);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products">
            <ArrowRight data-icon="inline-start" />
            رجوع للمنتجات
          </Link>
        </Button>

        {user?.role === "admin" && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/products/${product.id}/edit`}>
              <Pencil data-icon="inline-start" />
              تعديل المنتج
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {outOfStock ? (
              <Badge variant="destructive">نفد المخزون</Badge>
            ) : (
              <Badge variant="secondary">متوفر: {product.stock}</Badge>
            )}
          </div>

          <StarRating value={product.ratingAverage} count={product.ratingCount} size="md" />

          <p className="text-3xl font-semibold">{formatPrice(product.priceCents)}</p>

          <div className="flex flex-wrap items-center gap-2">
            <AddToCartButton productId={product.id} stock={product.stock} />
            <WishlistButton
              productId={product.id}
              initialInWishlist={inWishlist}
              variant="full"
            />
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-medium">الوصف</h2>
            <p className="leading-7 text-muted-foreground">
              {product.description || "لا يوجد وصف لهذا المنتج."}
            </p>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} reviews={reviews} mine={myReview} />
    </div>
  );
}
