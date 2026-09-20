"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { ordersApi } from "@/lib/shop-client-api";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const cancel = async () => {
    setIsPending(true);
    try {
      await ordersApi.cancel(orderId);
      toast.success("تم إلغاء الطلب وإرجاع الكمية للمخزون");
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر إلغاء الطلب"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-destructive" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : <XCircle />}
          إلغاء الطلب
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>إلغاء الطلب</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم إلغاء الطلب وإرجاع الكميات إلى المخزون. لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={cancel}>تأكيد الإلغاء</AlertDialogAction>
          <AlertDialogCancel>تراجع</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
