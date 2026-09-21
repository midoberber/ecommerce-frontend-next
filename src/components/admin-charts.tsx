"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatPrice } from "@/lib/format";
import { orderStatusLabels } from "@/lib/order-status";
import type { AdminStats } from "@/types/admin";

const revenueConfig = {
  revenue: { label: "الإيرادات", color: "var(--primary)" },
} satisfies ChartConfig;

const statusConfig = {
  count: { label: "عدد الطلبات" },
} satisfies ChartConfig;

const INACTIVE_STATUSES = new Set(["cancelled", "failed"]);

function formatDay(date: string) {
  return new Date(date).toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
}

export function AdminCharts({
  salesTrend,
  ordersByStatus,
}: {
  salesTrend: AdminStats["salesTrend"];
  ordersByStatus: AdminStats["ordersByStatus"];
}) {
  const revenueData = salesTrend.map((point) => ({
    date: point.date,
    label: formatDay(point.date),
    revenue: point.revenueCents / 100,
    orders: point.orderCount,
  }));

  const statusData = ordersByStatus.map((item) => ({
    status: item.status,
    label: orderStatusLabels[item.status],
    count: item.count,
    inactive: INACTIVE_STATUSES.has(item.status),
  }));

  const totalRevenue = salesTrend.reduce((sum, point) => sum + point.revenueCents, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">الإيرادات خلال آخر 14 يوماً</CardTitle>
          <CardDescription>
            الإجمالي {formatPrice(totalRevenue)} من الطلبات المدفوعة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="aspect-auto h-56 w-full">
            <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(value: number) => value.toLocaleString("ar-EG")}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => formatDay(payload?.[0]?.payload?.date)}
                    formatter={(value) => [
                      `${formatPrice(Number(value) * 100)}`,
                      " الإيرادات",
                    ]}
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="monotone"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                fill="url(#revenueFill)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">الطلبات حسب الحالة</CardTitle>
          <CardDescription>توزيع كل الطلبات على مراحل التنفيذ</CardDescription>
        </CardHeader>
        <CardContent>
          {statusData.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد طلبات بعد.</p>
          ) : (
            <ChartContainer config={statusConfig} className="aspect-auto h-56 w-full">
              <BarChart data={statusData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent formatter={(value) => [`${value}`, " طلب"]} />}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56}>
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={entry.inactive ? "var(--muted-foreground)" : "var(--primary)"}
                      fillOpacity={entry.inactive ? 0.35 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
