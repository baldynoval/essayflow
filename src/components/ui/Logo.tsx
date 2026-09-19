import Link from 'next/link';
import { cn } from '@/lib/cn';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('size-6', className)} fill="none">
      <rect width="32" height="32" rx="9" className="fill-ink" />
      <path d="M9 10.5h14M9 16h8.5M9 21.5h14" className="stroke-bg" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M19.5 16H23" className="stroke-accent" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ href = '/', className }: { href?: string; className?: string }) {
  return (
    <Link href={href} aria-label="EssayFlow — beranda" className={cn('inline-flex items-center gap-2 rounded-sm', className)}>
      <LogoMark />
      <span className="text-body font-semibold tracking-tight">EssayFlow</span>
    </Link>
  );
}
