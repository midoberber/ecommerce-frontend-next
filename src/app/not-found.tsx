import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <SearchX className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">الصفحة غير موجودة</h1>
      <p className="text-muted-foreground">الرابط الذي فتحته غير صحيح أو تم حذف الصفحة.</p>
      <Button asChild className="mt-2">
        <Link href="/products">العودة للمنتجات</Link>
      </Button>
    </div>
  );
}
