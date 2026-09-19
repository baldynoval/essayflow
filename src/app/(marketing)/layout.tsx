import type { ReactNode } from 'react';
import { MarketingFooter } from '@/components/layout/MarketingFooter';
import { TopNavigation } from '@/components/layout/TopNavigation';

/** Shared chrome for the public information pages (FAQ, bantuan, tentang, legal). */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNavigation />
      <main id="konten-utama" className="mx-auto w-full max-w-copy-lg px-5 py-16 md:px-8 md:py-24">
        {children}
      </main>
      <MarketingFooter />
    </>
  );
}
