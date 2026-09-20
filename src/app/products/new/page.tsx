import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewProductForm } from "@/components/new-product-form";
import { getSession } from "@/lib/server-api";

export const metadata: Metadata = { title: "منتج جديد" };

export default async function NewProductPage() {
  const user = await getSession();

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <ShieldAlert className="size-12 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">هذه الصفحة للمديرين فقط</h1>
        <p className="text-muted-foreground">حسابك الحالي لا يملك صلاحية إضافة منتجات.</p>
        <Button asChild className="mt-2">
          <Link href="/products">العودة للمنتجات</Link>
        </Button>
      </div>
    );
  }

  return <NewProductForm />;
}
