"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, PackagePlus, Receipt, ShoppingCart, Store } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/components/session-provider";
import { authApi } from "@/lib/auth-api";
import { cn } from "@/lib/utils";
import { cartItemCount, useCartStore } from "@/store/cart-store";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSession();
  const cart = useCartStore((s) => s.cart);
  const refreshCart = useCartStore((s) => s.refresh);
  const clearCart = useCartStore((s) => s.clear);
  const count = cartItemCount(cart);

  useEffect(() => {
    if (user) {
      void refreshCart();
    } else {
      clearCart();
    }
  }, [user, refreshCart, clearCart]);

  const handleLogout = async () => {
    await authApi.logout();
    clearCart();
    router.replace("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Store className="size-5" />
            متجري
          </Link>
          <nav className="flex items-center gap-0.5 sm:gap-1">
            {navLinks.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                    active && "bg-muted font-medium text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {user ? (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart" aria-label="سلة التسوق">
                <ShoppingCart />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground tabular-nums">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="قائمة الحساب"
                >
                  <Avatar>
                    <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    {user.name}
                    {user.role === "admin" && (
                      <Badge variant="secondary" className="text-[10px]">
                        مدير
                      </Badge>
                    )}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <Receipt />
                    طلباتي
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/products/new">
                      <PackagePlus />
                      منتج جديد
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
                  <LogOut />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">دخول</Link>
            </Button>
            <Button asChild>
              <Link href="/register">حساب جديد</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
