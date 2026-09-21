import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Package,
  Receipt,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdminCharts } from "@/components/admin-charts";
import { formatPrice } from "@/lib/format";
import { getServerAdminStats } from "@/lib/server-api";

export const metadata: Metadata = { title: "لوحة التحكم" };

export default async function AdminDashboardPage() {
  const stats = await getServerAdminStats();

  if (!stats) {
    return <p className="text-muted-foreground">تعذّر تحميل الإحصائيات.</p>;
  }

  const cards = [
    {
      label: "الإيرادات",
      value: formatPrice(stats.revenueCents),
      icon: TrendingUp,
      hint: "الطلبات المدفوعة والمشحونة والمسلّمة",
    },
    { label: "الطلبات", value: stats.orders, icon: Receipt, hint: "إجمالي الطلبات" },
    {
      label: "بانتظار الدفع",
      value: stats.pendingOrders,
      icon: Clock,
      hint: "طلبات لم تُدفع بعد",
    },
    { label: "المنتجات", value: stats.products, icon: Package, hint: "في المتجر" },
    {
      label: "نفد المخزون",
      value: stats.outOfStock,
      icon: AlertTriangle,
      hint: "منتجات بحاجة لتزويد",
    },
    { label: "المستخدمون", value: stats.users, icon: Users, hint: "حسابات مسجّلة" },
    { label: "التقييمات", value: stats.reviews, icon: Star, hint: "تقييمات منشورة" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <card.icon className="size-4 text-muted-foreground" />
              </div>
              <span className="text-2xl font-semibold">{card.value}</span>
              <span className="text-xs text-muted-foreground">{card.hint}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdminCharts salesTrend={stats.salesTrend} ordersByStatus={stats.ordersByStatus} />

      <Card>
        <CardContent className="flex flex-col gap-3">
          <h2 className="font-semibold">الأكثر مبيعاً</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد مبيعات بعد.</p>
          ) : (
            stats.topProducts.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </span>
                    {item.productId ? (
                      <Link href={`/products/${item.productId}`} className="hover:underline">
                        {item.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">{item.name} (محذوف)</span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.soldQuantity} قطعة
                  </span>
                </div>
                {index < stats.topProducts.length - 1 && <Separator />}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
