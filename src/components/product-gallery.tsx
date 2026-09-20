"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product-image";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <ProductImage src={null} alt={name} className="rounded-xl border" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <ProductImage src={images[active]} alt={name} className="rounded-xl border" />

      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "size-16 overflow-hidden rounded-lg border-2 transition-colors",
                index === active ? "border-primary" : "border-transparent hover:border-border",
              )}
              aria-label={`صورة ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- الصور من سيرفر الـ API مش من دومين ثابت */}
              <img src={mediaUrl(image)!} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
