"use client";

import Link from "next/link";
import { Check, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatAddressLine, type Address } from "@/types/address";

export function AddressPicker({
  addresses,
  selectedId,
  onSelect,
}: {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-4">
        <p className="text-sm text-muted-foreground">لا يوجد عنوان محفوظ</p>
        <Button size="sm" variant="outline" asChild>
          <Link href="/account/addresses">
            <Plus data-icon="inline-start" />
            أضف عنواناً
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {addresses.map((address) => {
        const selected = address.id === selectedId;
        return (
          <button
            key={address.id}
            type="button"
            onClick={() => onSelect(address.id)}
            className={cn(
              "flex items-start gap-2 rounded-lg border p-3 text-start transition-colors hover:bg-muted",
              selected && "border-primary bg-primary/5 hover:bg-primary/5",
            )}
          >
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="flex items-center gap-1.5 font-medium">
                {address.label}
                {selected && <Check className="size-3.5 text-primary" />}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {formatAddressLine(address)}
              </span>
            </div>
          </button>
        );
      })}

      <Button size="sm" variant="ghost" asChild className="self-start">
        <Link href="/account/addresses">
          <Plus data-icon="inline-start" />
          إدارة العناوين
        </Link>
      </Button>
    </div>
  );
}
