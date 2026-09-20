import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-muted to-muted/40",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- الرابط ممكن يكون من أي دومين خارجي
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        <ImageIcon className="size-10 text-muted-foreground/50" />
      )}
    </div>
  );
}
