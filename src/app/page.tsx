import { ProtectedShell } from '@/components/protected-shell';
import { HomeContent } from '@/components/home-content';

export default function Home() {
  return (
    <ProtectedShell>
      <HomeContent />
    </ProtectedShell>
  );
}
