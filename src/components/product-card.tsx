import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/components/product-image";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="overflow-hidden pt-0 transition-shadow group-hover:shadow-md">
        <div className="relative">
          <ProductImage
            src={product.images[0] ?? null}
            alt={product.name}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {product.images.length > 1 && (
            <span className="absolute bottom-2 end-2 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium">
              {product.images.length} صور
            </span>
          )}
        </div>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-medium">{product.name}</h3>
            {outOfStock && <Badge variant="destructive">نفد</Badge>}
          </div>
          <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
            {product.description || "بدون وصف"}
          </p>
          <p className="text-lg font-semibold">{formatPrice(product.priceCents)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
