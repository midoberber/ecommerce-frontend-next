import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountForm } from "@/components/account-form";
import { getSession } from "@/lib/server-api";

export const metadata: Metadata = { title: "الملف الشخصي" };

export default async function AccountPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login?next=/account");
  }

  return <AccountForm user={user} />;
}
