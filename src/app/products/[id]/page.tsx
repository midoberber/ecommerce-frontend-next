import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProduct } from '@/lib/products-api';

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('ar-EG', { style: 'currency', currency: 'SAR' });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link href="/products" className="text-sm text-gray-500 underline">
        &larr; رجوع للمنتجات
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">{product.name}</h1>
      <p className="mt-2 text-gray-600">{product.description}</p>
      <p className="mt-4 text-xl font-bold">{formatPrice(product.priceCents)}</p>
      <p className="mt-1 text-sm text-gray-500">المتاح بالمخزون: {product.stock}</p>
    </div>
  );
}
