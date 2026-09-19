'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogoMark } from '@/components/ui/Logo';
import { motionTokens } from '@/design/tokens';
import { cn } from '@/lib/cn';
import type { Role } from '@/types/domain';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV: Record<Role, NavItem[]> = {
  pengajar: [
    { label: 'Dasbor', href: '/teacher', icon: LayoutDashboard },
    { label: 'Tugas', href: '/teacher/tasks', icon: ClipboardList },
    { label: 'Kelas', href: '/teacher/classes', icon: BookOpen },
    { label: 'Mahasiswa', href: '/teacher/students', icon: Users },
    { label: 'Pengaturan', href: '/settings', icon: Settings },
  ],
  mahasiswa: [
    { label: 'Dasbor', href: '/student', icon: LayoutDashboard },
    { label: 'Tugas', href: '/student/tasks', icon: ClipboardList },
    { label: 'Hasil Penilaian', href: '/student/results', icon: GraduationCap },
    { label: 'Riwayat', href: '/student/history', icon: History },
    { label: 'Profil', href: '/settings', icon: Settings },
  ],
};

function isActive(pathname: string, href: string) {
  if (href === '/teacher' || href === '/student') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ role, collapsed, onNavigate }: { role: Role; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi utama" className="flex flex-col gap-1">
      {NAV[role].map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            title={collapsed ? label : undefined}
            className={cn(
              'flex h-10 items-center gap-3 rounded-sm px-3 text-body-sm transition-colors duration-200 motion-reduce:transition-none',
              collapsed && 'justify-center px-0',
              active ? 'bg-accent-soft font-medium text-accent' : 'text-ink-2 hover:bg-muted hover:text-ink',
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      title={collapsed ? 'Keluar' : undefined}
      className={cn(
        'flex h-10 items-center gap-3 rounded-sm px-3 text-body-sm text-ink-2 transition-colors duration-200 hover:bg-muted hover:text-ink disabled:opacity-50 motion-reduce:transition-none',
        collapsed && 'justify-center px-0',
      )}
    >
      <LogOut className="size-4 shrink-0" aria-hidden />
      {!collapsed && 'Keluar'}
    </button>
  );
}

export function Sidebar({ role }: { role: Role }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-bg p-4 transition-[width] duration-300 ease-ef-out motion-reduce:transition-none lg:flex',
      )}
      style={{ width: collapsed ? 72 : 248 }}
    >
      <div className={cn('flex items-center gap-2 px-2 pb-6', collapsed && 'justify-center px-0')}>
        <Link href={`/${role === 'pengajar' ? 'teacher' : 'student'}`} aria-label="EssayFlow" className="inline-flex items-center gap-2 rounded-sm">
          <LogoMark />
          {!collapsed && <span className="text-body font-semibold tracking-tight">EssayFlow</span>}
        </Link>
      </div>

      <NavLinks role={role} collapsed={collapsed} />

      <div className="mt-auto flex flex-col gap-1 border-t border-line pt-4">
        <LogoutButton collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
          className={cn(
            'flex h-10 items-center gap-3 rounded-sm px-3 text-body-sm text-ink-2 transition-colors duration-200 hover:bg-muted hover:text-ink motion-reduce:transition-none',
            collapsed && 'justify-center px-0',
          )}
        >
          {collapsed ? <PanelLeftOpen className="size-4" aria-hidden /> : <PanelLeftClose className="size-4" aria-hidden />}
          {!collapsed && 'Ciutkan menu'}
        </button>
      </div>
    </aside>
  );
}

export function MobileNav({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buka menu navigasi"
        className="inline-flex size-10 items-center justify-center rounded-sm border border-line text-ink transition-colors duration-200 hover:bg-muted motion-reduce:transition-none"
      >
        <Menu className="size-4" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : motionTokens.duration.fast }}
          >
            <button
              type="button"
              aria-label="Tutup menu navigasi"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink/40"
            />
            <motion.div
              className="relative flex h-full w-full max-w-xs flex-col border-r border-line bg-bg p-4"
              initial={reduce ? false : { x: -24 }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: -24 }}
              transition={{ duration: reduce ? 0 : motionTokens.duration.base, ease: motionTokens.ease }}
            >
              <div className="flex items-center justify-between pb-6">
                <span className="inline-flex items-center gap-2">
                  <LogoMark />
                  <span className="text-body font-semibold tracking-tight">EssayFlow</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup menu"
                  className="inline-flex size-8 items-center justify-center rounded-sm text-ink-2 hover:bg-muted hover:text-ink"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <NavLinks role={role} collapsed={false} onNavigate={() => setOpen(false)} />
              <div className="mt-auto border-t border-line pt-4">
                <LogoutButton collapsed={false} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
