import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin-nav";
import { getSession } from "@/lib/server-api";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getSession();

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <ShieldAlert className="size-12 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">لوحة التحكم للمديرين فقط</h1>
        <p className="text-muted-foreground">حسابك الحالي لا يملك صلاحية الدخول.</p>
        <Button asChild className="mt-2">
          <Link href="/">العودة للرئيسية</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">لوحة التحكم</h1>
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <AdminNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
