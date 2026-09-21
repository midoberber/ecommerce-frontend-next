"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Loader2, ShieldCheck, Undo2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/components/session-provider";
import { getErrorMessage } from "@/lib/errors";
import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { adminApi } from "@/lib/shop-client-api";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/admin";

export function AdminUsersTable({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const current = useSession();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<AdminUser | null>(null);

  const setBlocked = async (user: AdminUser, isBlocked: boolean) => {
    setPendingId(user.id);
    try {
      await adminApi.setUserBlocked(user.id, isBlocked);
      toast.success(isBlocked ? `تم حظر ${user.name}` : `تم فك الحظر عن ${user.name}`);
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر تحديث حالة المستخدم"));
    } finally {
      setPendingId(null);
      setConfirming(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <Users className="size-10 text-muted-foreground" />
        <p className="font-medium">لا يوجد مستخدمون</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">{users.length} مستخدم</p>

      {users.map((user) => {
        const isSelf = user.id === current?.id;
        const busy = pendingId === user.id;

        return (
          <Card key={user.id} className={cn(user.isBlocked && "border-destructive/40")}>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar>
                  {user.avatarUrl && (
                    <AvatarImage src={mediaUrl(user.avatarUrl)!} alt={user.name} />
                  )}
                  <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{user.name}</span>
                    {user.role === "admin" && (
                      <Badge variant="secondary" className="text-[10px]">
                        <ShieldCheck className="size-3" />
                        مدير
                      </Badge>
                    )}
                    {user.isBlocked && (
                      <Badge variant="destructive" className="text-[10px]">
                        <Ban className="size-3" />
                        محظور
                      </Badge>
                    )}
                    {isSelf && <span className="text-xs text-muted-foreground">(أنت)</span>}
                  </div>
                  <span className="truncate text-sm text-muted-foreground" dir="ltr">
                    {user.email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.orderCount} طلب · أنفق {formatPrice(Number(user.totalSpentCents))}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  انضم {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                </span>

                {user.isBlocked ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => setBlocked(user, false)}
                  >
                    {busy ? <Loader2 className="animate-spin" /> : <Undo2 />}
                    فك الحظر
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    disabled={busy || isSelf || user.role === "admin"}
                    onClick={() => setConfirming(user)}
                  >
                    {busy ? <Loader2 className="animate-spin" /> : <Ban />}
                    حظر
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <AlertDialog open={!!confirming} onOpenChange={(open) => !open && setConfirming(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حظر المستخدم</AlertDialogTitle>
            <AlertDialogDescription>
              لن يتمكن &quot;{confirming?.name}&quot; من تسجيل الدخول أو استخدام المتجر، وستُلغى
              جلسته الحالية فوراً. يمكنك فك الحظر لاحقاً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => confirming && setBlocked(confirming, true)}>
              حظر
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
