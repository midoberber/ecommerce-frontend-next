"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MapPin, MapPinPlus, Pencil, Phone, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddressFormDialog } from "@/components/address-form-dialog";
import { getErrorMessage } from "@/lib/errors";
import { addressesApi } from "@/lib/shop-client-api";
import { formatAddressLine, type Address } from "@/types/address";

export function AddressesManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState<Address | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const refresh = async () => {
    setAddresses(await addressesApi.list());
    router.refresh();
  };

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setDialogOpen(true);
  };

  const makeDefault = async (address: Address) => {
    setPendingId(address.id);
    try {
      await addressesApi.setDefault(address.id);
      await refresh();
      toast.success("تم تعيين العنوان الافتراضي");
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر تعيين العنوان"));
    } finally {
      setPendingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;

    setPendingId(deleting.id);
    try {
      await addressesApi.remove(deleting.id);
      await refresh();
      toast.success("تم حذف العنوان");
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر حذف العنوان"));
    } finally {
      setPendingId(null);
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {addresses.length > 0 ? `${addresses.length} عنوان محفوظ` : "لا توجد عناوين"}
        </p>
        <Button onClick={openNew}>
          <MapPinPlus data-icon="inline-start" />
          عنوان جديد
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <MapPin className="size-10 text-muted-foreground" />
          <p className="font-medium">لم تضف أي عنوان بعد</p>
          <p className="text-sm text-muted-foreground">
            أضف عنواناً لتتمكن من إتمام طلباتك بسرعة.
          </p>
          <Button onClick={openNew} className="mt-2">
            إضافة عنوان
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : undefined}>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="font-medium">{address.label}</span>
                  </div>
                  {address.isDefault && (
                    <Badge variant="secondary">
                      <Check className="size-3" />
                      افتراضي
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{address.fullName}</span>
                  <span className="flex items-center gap-1.5" dir="ltr">
                    <Phone className="size-3.5" />
                    {address.phone}
                  </span>
                  <span>{formatAddressLine(address)}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(address)}>
                    <Pencil />
                    تعديل
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pendingId === address.id}
                      onClick={() => makeDefault(address)}
                    >
                      <Check />
                      تعيين كافتراضي
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    disabled={pendingId === address.id}
                    onClick={() => setDeleting(address)}
                  >
                    <Trash2 />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editing}
        onSaved={refresh}
      />

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف العنوان</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف &quot;{deleting?.label}&quot; نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={confirmDelete}>حذف</AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
