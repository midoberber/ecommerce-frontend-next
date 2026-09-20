"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import { ordersApi } from "@/lib/shop-client-api";
import type { OrderDetail } from "@/types/shop";

const schema = z.object({
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{16}$/, "رقم البطاقة يجب أن يكون 16 رقماً")),
  cardHolder: z.string().min(2, "أدخل اسم حامل البطاقة"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "الصيغة MM/YY"),
  cvc: z.string().regex(/^\d{3}$/, "3 أرقام"),
});

type FormValues = z.input<typeof schema>;

export function PaymentForm({ order }: { order: OrderDetail }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { cardNumber: "", cardHolder: "", expiry: "", cvc: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await ordersApi.pay(order.id, {
        ...values,
        cardNumber: values.cardNumber.replace(/\s/g, ""),
      });
      toast.success("تم الدفع بنجاح");
      router.replace(`/orders/${order.id}`);
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "فشلت عملية الدفع"));
    }
  };

  const fillTestCard = (cardNumber: string) => {
    setValue("cardNumber", cardNumber.replace(/(.{4})/g, "$1 ").trim());
    setValue("cardHolder", "AHMED NAGEEP");
    setValue("expiry", "12/30");
    setValue("cvc", "123");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="size-5" />
            بيانات الدفع
          </CardTitle>
          <CardDescription>بوابة دفع تجريبية — لا تُستخدم بيانات بطاقات حقيقية</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.cardNumber}>
                <FieldLabel htmlFor="cardNumber">رقم البطاقة</FieldLabel>
                <Input
                  id="cardNumber"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  aria-invalid={!!errors.cardNumber}
                  {...register("cardNumber")}
                />
                <FieldError errors={[errors.cardNumber]} />
              </Field>

              <Field data-invalid={!!errors.cardHolder}>
                <FieldLabel htmlFor="cardHolder">اسم حامل البطاقة</FieldLabel>
                <Input
                  id="cardHolder"
                  dir="ltr"
                  placeholder="AHMED NAGEEP"
                  aria-invalid={!!errors.cardHolder}
                  {...register("cardHolder")}
                />
                <FieldError errors={[errors.cardHolder]} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={!!errors.expiry}>
                  <FieldLabel htmlFor="expiry">تاريخ الانتهاء</FieldLabel>
                  <Input
                    id="expiry"
                    dir="ltr"
                    placeholder="MM/YY"
                    aria-invalid={!!errors.expiry}
                    {...register("expiry")}
                  />
                  <FieldError errors={[errors.expiry]} />
                </Field>

                <Field data-invalid={!!errors.cvc}>
                  <FieldLabel htmlFor="cvc">CVC</FieldLabel>
                  <Input
                    id="cvc"
                    dir="ltr"
                    inputMode="numeric"
                    placeholder="123"
                    aria-invalid={!!errors.cvc}
                    {...register("cvc")}
                  />
                  <FieldError errors={[errors.cvc]} />
                </Field>
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Lock />}
                ادفع {formatPrice(order.totalCents)}
              </Button>
            </FieldGroup>
          </form>

          <Separator className="my-6" />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">بطاقات للتجربة</p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestCard("4242424242424242")}
              >
                بطاقة ناجحة
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestCard("4000000000000002")}
              >
                بطاقة مرفوضة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardContent className="flex flex-col gap-3">
          <h2 className="font-semibold">ملخص الطلب</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-2 text-sm">
              <span className="text-muted-foreground">
                {item.productName} × {item.quantity}
              </span>
              <span>{formatPrice(item.unitPriceCents * item.quantity)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>الإجمالي</span>
            <span>{formatPrice(order.totalCents)}</span>
          </div>
          {order.shippingAddress && (
            <>
              <Separator />
              <div className="text-sm">
                <p className="font-medium">عنوان الشحن</p>
                <p className="text-muted-foreground">{order.shippingAddress}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
