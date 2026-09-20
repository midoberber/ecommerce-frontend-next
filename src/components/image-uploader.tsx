"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { mediaUrl } from "@/lib/media";
import { uploadImages } from "@/lib/shop-client-api";
import { cn } from "@/lib/utils";

export function ImageUploader({
  value,
  onChange,
  max = 6,
  className,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList).slice(0, max - value.length);
    if (files.length === 0) {
      toast.error(`الحد الأقصى ${max} صور`);
      return;
    }

    setIsUploading(true);
    try {
      const urls = await uploadImages(files);
      onChange([...value, ...urls]);
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر رفع الصور"));
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap gap-2">
        {value.map((url, index) => (
          <div key={url} className="group relative size-20 overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element -- الصور من سيرفر الـ API مش من دومين ثابت */}
            <img src={mediaUrl(url)!} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute top-1 end-1 rounded-full bg-background/90 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="حذف الصورة"
            >
              <X className="size-3.5" />
            </button>
            {index === 0 && (
              <span className="absolute inset-x-0 bottom-0 bg-primary/90 py-0.5 text-center text-[10px] text-primary-foreground">
                الغلاف
              </span>
            )}
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex size-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="size-5" />
                <span className="text-[10px]">إضافة</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-muted-foreground">
        حتى {max} صور، كل صورة أقل من 5 ميجابايت. أول صورة هي الغلاف.
      </p>

      {value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start text-destructive"
          onClick={() => onChange([])}
        >
          حذف كل الصور
        </Button>
      )}
    </div>
  );
}
