"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductView } from "@/types/product";

export function ViewToggle({ view }: { view: ProductView }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setView = (next: ProductView) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next === "grid") {
      params.delete("view");
    } else {
      params.set("view", next);
    }

    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-0.5 rounded-lg border p-0.5">
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => setView("grid")}
        aria-label="عرض شبكي"
        aria-pressed={view === "grid"}
      >
        <LayoutGrid />
      </Button>
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => setView("list")}
        aria-label="عرض قائمة"
        aria-pressed={view === "list"}
      >
        <List />
      </Button>
    </div>
  );
}
