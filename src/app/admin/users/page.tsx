import type { Metadata } from "next";
import { AdminUsersTable } from "@/components/admin-users-table";
import { getServerAdminUsers } from "@/lib/server-api";

export const metadata: Metadata = { title: "المستخدمون" };

export default async function AdminUsersPage() {
  const users = (await getServerAdminUsers()) ?? [];

  return <AdminUsersTable users={users} />;
}
