"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <TriangleAlert className="size-12 text-destructive" />
      <h1 className="text-2xl font-semibold">حدث خطأ غير متوقع</h1>
      <p className="text-muted-foreground">
        تعذّر تحميل البيانات. تأكد أن السيرفر يعمل ثم حاول مرة أخرى.
      </p>
      <Button onClick={reset} className="mt-2">
        إعادة المحاولة
      </Button>
    </div>
  );
}
