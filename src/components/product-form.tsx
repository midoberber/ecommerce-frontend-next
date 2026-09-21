"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/image-uploader";
import { getErrorMessage } from "@/lib/errors";
import { adminApi, productsApi } from "@/lib/shop-client-api";
import type { Product } from "@/types/product";
import type { Category } from "@/types/shop";

const schema = z.object({
  name: z.string().min(2, "اسم المنتج قصير جداً"),
  description: z.string().optional(),
  price: z.number({ error: "أدخل السعر" }).min(0, "السعر لا يمكن أن يكون سالباً"),
  stock: z
    .number({ error: "أدخل الكمية" })
    .int("الكمية يجب أن تكون رقماً صحيحاً")
    .min(0, "الكمية لا يمكن أن تكون سالبة"),
  categoryId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product: Product | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product ? product.priceCents / 100 : undefined,
      stock: product?.stock ?? 0,
      categoryId: product?.categoryId ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      priceCents: Math.round(values.price * 100),
      stock: values.stock,
      categoryId: values.categoryId || undefined,
      images,
    };

    try {
      if (product) {
        await adminApi.updateProduct(product.id, payload);
        toast.success("تم تحديث المنتج");
        router.push(`/products/${product.id}`);
      } else {
        await productsApi.create(payload);
        toast.success("تمت إضافة المنتج");
        router.push("/products");
      }
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر حفظ المنتج"));
    }
  };

  const remove = async () => {
    if (!product) return;

    setIsDeleting(true);
    try {
      await adminApi.deleteProduct(product.id);
      toast.success("تم حذف المنتج");
      router.push("/products");
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر حذف المنتج"));
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{isEdit ? "تعديل المنتج" : "منتج جديد"}</CardTitle>
          <CardDescription>
            {isEdit ? "حدّث بيانات المنتج" : "أضف منتجاً جديداً إلى المتجر"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel>صور المنتج</FieldLabel>
                <ImageUploader value={images} onChange={setImages} />
              </Field>

              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">اسم المنتج</FieldLabel>
                <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">الوصف</FieldLabel>
                <Textarea id="description" rows={4} {...register("description")} />
              </Field>

              {categories.length > 0 && (
                <Field>
                  <FieldLabel htmlFor="categoryId">الفئة</FieldLabel>
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="categoryId" className="w-full">
                          <SelectValue placeholder="اختر فئة (اختياري)" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              )}

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

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  {isEdit ? "حفظ التعديلات" : "حفظ المنتج"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  إلغاء
                </Button>

                {isEdit && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="ms-auto text-destructive"
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        حذف المنتج
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف المنتج</AlertDialogTitle>
                        <AlertDialogDescription>
                          سيتم حذف &quot;{product?.name}&quot; وكل صوره وتقييماته نهائياً.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction onClick={remove}>حذف</AlertDialogAction>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
