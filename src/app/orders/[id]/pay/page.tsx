import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PaymentForm } from "@/components/payment-form";
import { getServerOrder } from "@/lib/server-api";

export const metadata: Metadata = { title: "الدفع" };

export default async function PayOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getServerOrder(id);

  if (!order) {
    notFound();
  }

  if (order.status === "paid" || order.status === "cancelled") {
    redirect(`/orders/${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">إتمام الدفع</h1>
      <PaymentForm order={order} />
    </div>
  );
}
