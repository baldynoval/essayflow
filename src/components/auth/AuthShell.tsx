import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Reveal } from '@/components/ui/Reveal';
import { AuthVisual } from './AuthVisual';

export interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  /** Small print under the form, e.g. “Belum memiliki akun? Daftar”. */
  footer?: ReactNode;
}

/**
 * Two-column authentication layout.
 * Left: brand panel (decorative, hidden below lg). Right: the form.
 * Mobile keeps the same hierarchy in one column — heading first, then form.
 */
export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-2">
      <section className="relative flex flex-col justify-between overflow-hidden bg-surface px-5 pb-10 pt-6 md:px-8 lg:px-12 lg:py-12">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm text-meta text-ink-2 transition-colors duration-200 hover:text-ink motion-reduce:transition-none"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Kembali ke beranda
          </Link>
        </div>

        <div className="mx-auto w-full max-w-copy py-10 lg:py-16">
          <Reveal>
            <h1 className="text-section text-ink">{title}</h1>
            <p className="mt-4 max-w-copy text-body text-ink-2">{description}</p>
          </Reveal>
          <Reveal delay={0.08} className="mt-10 hidden lg:block">
            <AuthVisual />
          </Reveal>
        </div>

        <p className="hidden text-meta text-ink-2 lg:block">
          Penilaian AI bersifat draf. Pengajar tetap pengambil keputusan akhir.
        </p>
      </section>

      <section className="flex items-center justify-center px-5 pb-16 pt-4 md:px-8 lg:px-12 lg:py-12">
        <div className="w-full max-w-md">
          {children}
          {footer && <div className="mt-8 text-center text-meta text-ink-2">{footer}</div>}
        </div>
      </section>
    </div>
  );
}
