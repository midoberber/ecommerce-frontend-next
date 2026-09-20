import type { Metadata } from "next";
import { ProtectedShell } from "@/components/protected-shell";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = { title: "سلة التسوق" };

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">سلة التسوق</h1>
      <ProtectedShell>
        <CartView />
      </ProtectedShell>
    </div>
  );
}
