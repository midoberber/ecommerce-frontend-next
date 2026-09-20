import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/shop";

export function CategoryFilter({
  categories,
  activeId,
}: {
  categories: Category[];
  activeId?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link
        href="/products"
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-muted",
          !activeId && "border-primary bg-primary text-primary-foreground hover:bg-primary",
        )}
      >
        الكل
      </Link>
      {categories.map((category) => {
        const active = category.id === activeId;
        return (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-muted",
              active && "border-primary bg-primary text-primary-foreground hover:bg-primary",
            )}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
