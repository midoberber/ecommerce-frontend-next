"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "أدخل كلمة السر"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await authApi.login(values);
      setAuth(res.accessToken, res.user);
      toast.success(`أهلاً ${res.user.name}`);
      router.replace("/");
    } catch (err) {
      toast.error(getErrorMessage(err, "بيانات الدخول غير صحيحة"));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md px-4 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل بريدك وكلمة السر للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  dir="ltr"
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">كلمة السر</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  dir="ltr"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <FieldError errors={[errors.password]} />
              </Field>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                دخول
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ليس لديك حساب؟{" "}
                <Link href="/register" className="font-medium text-foreground underline">
                  إنشاء حساب جديد
                </Link>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
