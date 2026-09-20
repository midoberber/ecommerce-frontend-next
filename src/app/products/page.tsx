import Link from 'next/link';
import { getProducts } from '@/lib/products-api';

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('ar-EG', { style: 'currency', currency: 'SAR' });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">المنتجات</h1>
        <Link href="/products/new" className="rounded bg-black px-4 py-2 text-white">
          + منتج جديد
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-6 text-gray-500">مفيش منتجات لسه.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="rounded border border-gray-200 p-4 hover:border-gray-400"
            >
              <h2 className="font-medium">{product.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>
              <p className="mt-2 font-semibold">{formatPrice(product.priceCents)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
