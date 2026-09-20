export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  district: string | null;
  street: string;
  details: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressPayload {
  label: string;
  fullName: string;
  phone: string;
  city: string;
  district?: string;
  street: string;
  details?: string;
  isDefault?: boolean;
}

export function formatAddressLine(address: Address) {
  return [address.city, address.district, address.street, address.details]
    .filter(Boolean)
    .join(" - ");
}
