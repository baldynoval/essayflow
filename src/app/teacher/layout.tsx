import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { requireRole } from '@/lib/auth/guard';

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  const session = await requireRole('pengajar', '/teacher');
  return (
    <AppShell role="pengajar" userName={session.name} userSubtitle="Pengajar">
      {children}
    </AppShell>
  );
}
