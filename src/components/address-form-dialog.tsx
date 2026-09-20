"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errors";
import { addressesApi } from "@/lib/shop-client-api";
import type { Address } from "@/types/address";

const schema = z.object({
  label: z.string().min(2, "اسم العنوان مطلوب (مثل: المنزل)").max(60),
  fullName: z.string().min(3, "الاسم الكامل مطلوب").max(255),
  phone: z.string().regex(/^[0-9+\s-]{7,20}$/, "رقم جوال غير صالح"),
  city: z.string().min(2, "المدينة مطلوبة").max(120),
  district: z.string().max(120).optional(),
  street: z.string().min(3, "الشارع مطلوب").max(255),
  details: z.string().max(500).optional(),
  isDefault: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  label: "",
  fullName: "",
  phone: "",
  city: "",
  district: "",
  street: "",
  details: "",
  isDefault: false,
};

export function AddressFormDialog({
  open,
  onOpenChange,
  address,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: Address | null;
  onSaved: (address: Address) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues });

  useEffect(() => {
    if (!open) return;

    reset(
      address
        ? {
            label: address.label,
            fullName: address.fullName,
            phone: address.phone,
            city: address.city,
            district: address.district ?? "",
            street: address.street,
            details: address.details ?? "",
            isDefault: address.isDefault,
          }
        : emptyValues,
    );
  }, [open, address, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      district: values.district || undefined,
      details: values.details || undefined,
    };

    try {
      const saved = address
        ? await addressesApi.update(address.id, payload)
        : await addressesApi.create(payload);

      toast.success(address ? "تم تحديث العنوان" : "تمت إضافة العنوان");
      onSaved(saved);
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر حفظ العنوان"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{address ? "تعديل العنوان" : "عنوان جديد"}</DialogTitle>
          <DialogDescription>بيانات الاستلام والتوصيل</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.label}>
              <FieldLabel htmlFor="label">اسم العنوان</FieldLabel>
              <Input
                id="label"
                placeholder="المنزل / العمل"
                aria-invalid={!!errors.label}
                {...register("label")}
              />
              <FieldError errors={[errors.label]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.fullName}>
                <FieldLabel htmlFor="fullName">اسم المستلم</FieldLabel>
                <Input id="fullName" aria-invalid={!!errors.fullName} {...register("fullName")} />
                <FieldError errors={[errors.fullName]} />
              </Field>

              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="phone">رقم الجوال</FieldLabel>
                <Input
                  id="phone"
                  dir="ltr"
                  placeholder="05xxxxxxxx"
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
                <FieldError errors={[errors.phone]} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.city}>
                <FieldLabel htmlFor="city">المدينة</FieldLabel>
                <Input id="city" aria-invalid={!!errors.city} {...register("city")} />
                <FieldError errors={[errors.city]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="district">الحي</FieldLabel>
                <Input id="district" {...register("district")} />
              </Field>
            </div>

            <Field data-invalid={!!errors.street}>
              <FieldLabel htmlFor="street">الشارع</FieldLabel>
              <Input id="street" aria-invalid={!!errors.street} {...register("street")} />
              <FieldError errors={[errors.street]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="details">تفاصيل إضافية</FieldLabel>
              <Textarea
                id="details"
                rows={2}
                placeholder="رقم المبنى، الدور، علامة مميزة..."
                {...register("details")}
              />
            </Field>

            <Field orientation="horizontal">
              <Controller
                control={control}
                name="isDefault"
                render={({ field }) => (
                  <Switch
                    id="isDefault"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <FieldLabel htmlFor="isDefault">اجعله العنوان الافتراضي</FieldLabel>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {address ? "حفظ التعديلات" : "إضافة العنوان"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
