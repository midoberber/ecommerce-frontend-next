import type { Metadata } from "next";
import { AddressesManager } from "@/components/addresses-manager";
import { getServerAddresses } from "@/lib/server-api";

export const metadata: Metadata = { title: "العناوين" };

export default async function AddressesPage() {
  const addresses = (await getServerAddresses()) ?? [];

  return <AddressesManager initialAddresses={addresses} />;
}
