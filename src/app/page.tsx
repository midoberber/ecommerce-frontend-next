import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/products-api";

export default async function Home() {
  const products = await getProducts();
  const latest = products.slice(0, 4);

  return (
    <div>
      <section className="border-b bg-gradient-to-b from-muted/60 to-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:py-24">
          <h1 className="max-w-2xl text-4xl leading-tight font-bold sm:text-5xl">
            تسوّق أحدث المنتجات بأفضل الأسعار
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            متجر إلكتروني بسيط مبني بـ NestJS و Next.js، نتعلم بيه خطوة بخطوة.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">
              تصفح المنتجات
              <ArrowLeft data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">أحدث المنتجات</h2>
          <Button variant="link" asChild>
            <Link href="/products">عرض الكل</Link>
          </Button>
        </div>
        {latest.length === 0 ? (
          <p className="text-muted-foreground">لا توجد منتجات بعد.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {latest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
