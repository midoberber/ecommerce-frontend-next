"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Receipt, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "الملف الشخصي", icon: UserRound },
  { href: "/account/addresses", label: "العناوين", icon: MapPin },
  { href: "/orders", label: "طلباتي", icon: Receipt },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-muted font-medium text-foreground",
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
