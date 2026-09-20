export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("ar-EG", { style: "currency", currency: "SAR" });
}
