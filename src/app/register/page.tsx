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

const schema = z.object({
  name: z.string().min(2, "الاسم قصير جداً"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة السر يجب ألا تقل عن 6 أحرف"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await authApi.register(values);
      toast.success("تم إنشاء حسابك بنجاح");
      router.replace("/");
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "حدث خطأ، حاول مرة أخرى"));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md px-4 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">إنشاء حساب</CardTitle>
          <CardDescription>سجّل بياناتك للبدء</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">الاسم</FieldLabel>
                <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>

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
                إنشاء حساب
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                لديك حساب؟{" "}
                <Link href="/login" className="font-medium text-foreground underline">
                  تسجيل الدخول
                </Link>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
