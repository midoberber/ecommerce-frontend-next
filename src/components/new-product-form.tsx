'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { productsClientApi } from '@/lib/products-client-api';

const schema = z.object({
  name: z.string().min(2, 'اسم المنتج قصير جداً'),
  description: z.string().optional(),
  priceCents: z.coerce.number().int().min(0, 'السعر لازم يكون رقم صحيح'),
  stock: z.coerce.number().int().min(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export function NewProductForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await productsClientApi.create(values);
      router.push('/products');
      router.refresh();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'حدث خطأ، حاول مرة أخرى')
        : 'حدث خطأ، حاول مرة أخرى';
      setServerError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold">منتج جديد</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-3">
        <div>
          <input
            {...register('name')}
            placeholder="اسم المنتج"
            className="w-full rounded border border-gray-300 p-2"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <textarea
            {...register('description')}
            placeholder="الوصف"
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>
        <div>
          <input
            {...register('priceCents')}
            type="number"
            placeholder="السعر (بالقروش/السنت)"
            className="w-full rounded border border-gray-300 p-2"
          />
          {errors.priceCents && (
            <p className="text-sm text-red-500">{errors.priceCents.message}</p>
          )}
        </div>
        <div>
          <input
            {...register('stock')}
            type="number"
            placeholder="الكمية بالمخزون"
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </form>
    </div>
  );
}
