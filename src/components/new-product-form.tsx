"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errors";
import { productsClientApi } from "@/lib/products-client-api";

const schema = z.object({
  name: z.string().min(2, "اسم المنتج قصير جداً"),
  description: z.string().optional(),
  price: z
    .number({ error: "أدخل السعر" })
    .min(0, "السعر لا يمكن أن يكون سالباً"),
  stock: z
    .number({ error: "أدخل الكمية" })
    .int("الكمية يجب أن تكون رقماً صحيحاً")
    .min(0, "الكمية لا يمكن أن تكون سالبة"),
  imageUrl: z.union([z.literal(""), z.string().url("رابط غير صالح")]),
});

type FormValues = z.infer<typeof schema>;

export function NewProductForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", stock: 0, imageUrl: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await productsClientApi.create({
        name: values.name,
        description: values.description || undefined,
        priceCents: Math.round(values.price * 100),
        stock: values.stock,
        imageUrl: values.imageUrl || undefined,
      });
      toast.success("تمت إضافة المنتج");
      router.push("/products");
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر حفظ المنتج"));
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">منتج جديد</CardTitle>
          <CardDescription>أضف منتجاً جديداً إلى المتجر</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">اسم المنتج</FieldLabel>
                <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">الوصف</FieldLabel>
                <Textarea id="description" rows={4} {...register("description")} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={!!errors.price}>
                  <FieldLabel htmlFor="price">السعر (ر.س)</FieldLabel>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    dir="ltr"
                    aria-invalid={!!errors.price}
                    {...register("price", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.price]} />
                </Field>

                <Field data-invalid={!!errors.stock}>
                  <FieldLabel htmlFor="stock">الكمية</FieldLabel>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    dir="ltr"
                    aria-invalid={!!errors.stock}
                    {...register("stock", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.stock]} />
                </Field>
              </div>

              <Field data-invalid={!!errors.imageUrl}>
                <FieldLabel htmlFor="imageUrl">رابط الصورة (اختياري)</FieldLabel>
                <Input
                  id="imageUrl"
                  type="url"
                  dir="ltr"
                  placeholder="https://..."
                  aria-invalid={!!errors.imageUrl}
                  {...register("imageUrl")}
                />
                <FieldDescription>رابط مباشر لصورة المنتج.</FieldDescription>
                <FieldError errors={[errors.imageUrl]} />
              </Field>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  حفظ المنتج
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  إلغاء
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
