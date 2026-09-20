'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';

export function HomeContent() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">أهلاً، {user?.name}</h1>
        <button onClick={logout} className="rounded border border-gray-300 p-2">
          تسجيل الخروج
        </button>
      </div>
      <Link href="/products" className="mt-4 inline-block underline">
        عرض المنتجات
      </Link>
      <p className="mt-4 text-gray-500">هنا هنبني السلة والطلبات في الخطوات الجاية.</p>
    </div>
  );
}
