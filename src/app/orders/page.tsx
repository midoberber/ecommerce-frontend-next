import type { Metadata } from "next";
import { ProtectedShell } from "@/components/protected-shell";
import { OrdersList } from "@/components/orders-list";

export const metadata: Metadata = { title: "طلباتي" };

export default function OrdersPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">طلباتي</h1>
      <ProtectedShell>
        <OrdersList />
      </ProtectedShell>
    </div>
  );
}
