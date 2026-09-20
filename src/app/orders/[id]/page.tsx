import type { Metadata } from "next";
import { ProtectedShell } from "@/components/protected-shell";
import { OrderDetail } from "@/components/order-detail";

export const metadata: Metadata = { title: "تفاصيل الطلب" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <ProtectedShell>
        <OrderDetail orderId={id} />
      </ProtectedShell>
    </div>
  );
}
