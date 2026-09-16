'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/store/auth-store';

const schema = z.object({
  name: z.string().min(2, 'الاسم قصير جداً'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة السر لازم تكون 6 أحرف على الأقل'),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await authApi.register(values);
      setAuth(res.accessToken, res.user);
      router.replace('/');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'حدث خطأ، حاول مرة أخرى')
        : 'حدث خطأ، حاول مرة أخرى';
      setServerError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">إنشاء حساب</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <input
            {...register('name')}
            placeholder="الاسم"
            className="w-full rounded border border-gray-300 p-2"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <input
            {...register('email')}
            placeholder="البريد الإلكتروني"
            className="w-full rounded border border-gray-300 p-2"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <input
            {...register('password')}
            type="password"
            placeholder="كلمة السر"
            className="w-full rounded border border-gray-300 p-2"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء حساب'}
        </button>
      </form>
      <p className="text-sm">
        عندك حساب بالفعل؟{' '}
        <Link href="/login" className="underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
