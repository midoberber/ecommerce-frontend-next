"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getErrorMessage } from "@/lib/errors";
import { mediaUrl } from "@/lib/media";
import { profileApi, uploadImages } from "@/lib/shop-client-api";
import type { AuthUser } from "@/types/auth";

const schema = z.object({
  name: z.string().min(2, "الاسم قصير جداً"),
  phone: z.union([z.literal(""), z.string().regex(/^[0-9+\s-]{7,20}$/, "رقم جوال غير صالح")]),
});

type FormValues = z.infer<typeof schema>;

export function AccountForm({ user }: { user: AuthUser }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
    },
  });

  const handleAvatar = async (files: FileList | null) => {
    if (!files?.length) return;

    setIsUploadingAvatar(true);
    try {
      const [url] = await uploadImages([files[0]]);
      await profileApi.update({ avatarUrl: url });
      setAvatarUrl(url);
      toast.success("تم تحديث الصورة");
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر رفع الصورة"));
    } finally {
      setIsUploadingAvatar(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await profileApi.update({
        name: values.name,
        phone: values.phone || undefined,
      });
      toast.success("تم حفظ البيانات");
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر حفظ البيانات"));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar className="size-20">
              {avatarUrl && <AvatarImage src={mediaUrl(avatarUrl)!} alt={user.name} />}
              <AvatarFallback className="text-2xl">
                {user.name.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-1 -end-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow transition-opacity hover:opacity-90 disabled:opacity-50"
              aria-label="تغيير الصورة"
            >
              {isUploadingAvatar ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Camera className="size-3.5" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleAvatar(e.target.files)}
            />
          </div>

          <div className="flex flex-col items-center gap-1 sm:items-start">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{user.name}</span>
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role === "admin" ? (
                  <>
                    <ShieldCheck className="size-3" />
                    مدير
                  </>
                ) : (
                  "عميل"
                )}
              </Badge>
            </div>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="size-3.5" />
              {user.email}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">البيانات الشخصية</CardTitle>
          <CardDescription>
            عناوين الشحن تُدار من{" "}
            <Link href="/account/addresses" className="underline">
              صفحة العناوين
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">الاسم</FieldLabel>
                <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <Input id="email" dir="ltr" value={user.email} disabled />
                <FieldDescription>لا يمكن تغيير البريد الإلكتروني.</FieldDescription>
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

              <Separator />

              <Button type="submit" disabled={isSubmitting} className="self-start">
                {isSubmitting && <Loader2 className="animate-spin" />}
                حفظ التغييرات
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
