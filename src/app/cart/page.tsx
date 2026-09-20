import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { getServerCart } from "@/lib/server-api";

export const metadata: Metadata = { title: "سلة التسوق" };

export default async function CartPage() {
  const cart = await getServerCart();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">سلة التسوق</h1>
      <CartView initialCart={cart} />
    </div>
  );
}
