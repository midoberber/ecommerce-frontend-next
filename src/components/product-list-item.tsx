import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/components/product-image";
import { StarRating } from "@/components/star-rating";
import { WishlistButton } from "@/components/wishlist-button";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

export function ProductListItem({
  product,
  inWishlist = false,
}: {
  product: Product;
  inWishlist?: boolean;
}) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="transition-colors group-hover:border-primary/40">
        <CardContent className="flex items-center gap-4">
          <ProductImage
            src={product.images[0] ?? null}
            alt={product.name}
            className="size-24 shrink-0 rounded-lg"
          />

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium">{product.name}</h3>
              {product.stock === 0 && <Badge variant="destructive">نفد</Badge>}
            </div>
            <StarRating value={product.ratingAverage} count={product.ratingCount} />
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.description || "بدون وصف"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <WishlistButton productId={product.id} initialInWishlist={inWishlist} />
            <span className="text-lg font-semibold">{formatPrice(product.priceCents)}</span>
            <ChevronLeft className="size-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
