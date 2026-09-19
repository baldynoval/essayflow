'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { NAV_LINKS } from '@/data/landing';
import { motionTokens } from '@/design/tokens';
import { cn } from '@/lib/cn';

/** Marketing top navigation: EssayFlow · Produk · Cara Kerja · FAQ · Tentang · Masuk · Mulai Sekarang */
export function TopNavigation() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300 motion-reduce:transition-none',
        scrolled || open ? 'border-line bg-bg/90 backdrop-blur-md' : 'border-transparent bg-bg',
      )}
    >
      <Container size="marketing">
        <nav aria-label="Navigasi utama" className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <Logo />
            <ul className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex h-10 items-center rounded-sm px-3 text-body-sm text-ink-2 transition-colors hover:bg-muted hover:text-ink motion-reduce:transition-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button href="/login" variant="secondary">
              Masuk
            </Button>
            <Button href="/login">Mulai Sekarang</Button>
          </div>

          <button
            type="button"
            className="-mr-3 inline-flex size-12 items-center justify-center rounded-sm hover:bg-muted md:hidden"
            aria-expanded={open}
            aria-controls="menu-seluler"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-seluler"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : motionTokens.duration.base, ease: motionTokens.ease }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <Container size="marketing" className="py-4">
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex h-12 items-center rounded-sm px-2 text-body font-medium hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-3 pb-2">
                <Button href="/login" variant="secondary" size="lg" fullWidth>
                  Masuk
                </Button>
                <Button href="/login" size="lg" fullWidth>
                  Mulai Sekarang
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
