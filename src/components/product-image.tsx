import { ImageIcon } from "lucide-react";
import { mediaUrl } from "@/lib/media";
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
  const url = mediaUrl(src);

  return (
    <div
      className={cn(
        "relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-muted to-muted/40",
        className,
      )}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- الصور من سيرفر الـ API مش من دومين ثابت
        <img src={url} alt={alt} className="size-full object-cover" />
      ) : (
        <ImageIcon className="size-10 text-muted-foreground/50" />
      )}
    </div>
  );
}
