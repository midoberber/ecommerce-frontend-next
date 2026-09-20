"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ProductSort } from "@/types/product";
import type { Category } from "@/types/shop";

const sortLabels: Record<ProductSort, string> = {
  newest: "الأحدث",
  price_asc: "الأقل سعراً",
  price_desc: "الأعلى سعراً",
  name: "الاسم (أ-ي)",
};

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId") ?? undefined;
  const search = searchParams.get("search") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sort = (searchParams.get("sort") as ProductSort | null) ?? "newest";

  const hasFilters = Boolean(categoryId || search || minPrice || maxPrice) || sort !== "newest";

  const apply = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    apply({
      search: String(formData.get("search") ?? "").trim() || undefined,
      minPrice: String(formData.get("minPrice") ?? "").trim() || undefined,
      maxPrice: String(formData.get("maxPrice") ?? "").trim() || undefined,
    });
  };

  return (
    <div className="mb-6 flex flex-col gap-4">
      <form onSubmit={onSearchSubmit} className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={search}
            placeholder="ابحث عن منتج..."
            className="h-9 ps-8"
          />
        </div>
        <Input
          name="minPrice"
          type="number"
          min="0"
          dir="ltr"
          defaultValue={minPrice}
          placeholder="من (ر.س)"
          className="h-9 w-28"
        />
        <Input
          name="maxPrice"
          type="number"
          min="0"
          dir="ltr"
          defaultValue={maxPrice}
          placeholder="إلى (ر.س)"
          className="h-9 w-28"
        />
        <Button type="submit" size="sm" className="h-9">
          بحث
        </Button>

        <Select value={sort} onValueChange={(value) => apply({ sort: value })}>
          <SelectTrigger size="sm" className="h-9 w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sortLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9"
            onClick={() => router.push("/products")}
          >
            <X />
            مسح
          </Button>
        )}
      </form>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => apply({ categoryId: undefined })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-muted",
              !categoryId && "border-primary bg-primary text-primary-foreground hover:bg-primary",
            )}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => apply({ categoryId: category.id })}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-muted",
                category.id === categoryId &&
                  "border-primary bg-primary text-primary-foreground hover:bg-primary",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
