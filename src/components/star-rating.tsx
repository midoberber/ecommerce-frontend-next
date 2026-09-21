import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const starClass = size === "md" ? "size-5" : "size-3.5";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              starClass,
              index < Math.round(value)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className={cn("text-muted-foreground", size === "md" ? "text-sm" : "text-xs")}>
          {count > 0 ? `${value} (${count})` : "لا تقييمات"}
        </span>
      )}
    </div>
  );
}
