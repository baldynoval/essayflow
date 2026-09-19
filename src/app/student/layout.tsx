import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { requireRole } from '@/lib/auth/guard';

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const session = await requireRole('mahasiswa', '/student');
  return (
    <AppShell role="mahasiswa" userName={session.name} userSubtitle="Mahasiswa">
      {children}
    </AppShell>
  );
}
