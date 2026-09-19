import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { requireSession } from '@/lib/auth/guard';

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  const session = await requireSession('/settings');
  return (
    <AppShell
      role={session.role}
      userName={session.name}
      userSubtitle={session.role === 'pengajar' ? 'Pengajar' : 'Mahasiswa'}
    >
      {children}
    </AppShell>
  );
}
