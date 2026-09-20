import { ProtectedShell } from '@/components/protected-shell';
import { NewProductForm } from '@/components/new-product-form';

export default function NewProductPage() {
  return (
    <ProtectedShell>
      <NewProductForm />
    </ProtectedShell>
  );
}
