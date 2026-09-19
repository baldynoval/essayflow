import type { ReactNode } from 'react';
import { MobileNav, Sidebar } from '@/components/layout/Sidebar';
import { Avatar } from '@/components/ui/Avatar';
import { GlobalSearch } from '@/components/app/GlobalSearch';
import { NotificationBell } from '@/components/app/NotificationBell';
import type { Role } from '@/types/domain';

export interface AppShellProps {
  role: Role;
  userName: string;
  userSubtitle: string;
  children: ReactNode;
}

/** Shared application chrome for every authenticated page (teacher and student). */
export function AppShell({ role, userName, userSubtitle, children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh bg-surface">
      <Sidebar role={role} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-bg/90 px-5 backdrop-blur md:px-8">
          <MobileNav role={role} />
          <GlobalSearch role={role} />
          <div className="ml-auto flex items-center gap-3">
            <NotificationBell />
            <div className="flex items-center gap-3">
              <Avatar name={userName} size="sm" />
              <div className="hidden leading-tight sm:block">
                <p className="text-meta font-medium text-ink">{userName}</p>
                <p className="text-caption text-ink-2">{userSubtitle}</p>
              </div>
            </div>
          </div>
        </header>

        <main id="konten-utama" className="min-w-0 flex-1 px-5 py-8 md:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
