import type { Metadata } from "next";
import { AdminOrdersTable } from "@/components/admin-orders-table";
import { getServerAdminOrders } from "@/lib/server-api";

export const metadata: Metadata = { title: "إدارة الطلبات" };

export default async function AdminOrdersPage() {
  const orders = (await getServerAdminOrders()) ?? [];

  return <AdminOrdersTable orders={orders} />;
}
