import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { NAV_LINKS } from '@/data/landing';

export function MarketingFooter() {
  return (
    <footer className="border-t border-line">
      <Container size="marketing" className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-copy text-meta text-ink-2">
              Platform penilaian tugas akademik berbantuan AI. Pengajar tetap pengambil keputusan akhir.
            </p>
          </div>
          <nav aria-label="Tautan kaki halaman">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-8 items-center rounded-sm text-body-sm text-ink-2 hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/login" className="inline-flex min-h-8 items-center rounded-sm text-body-sm text-ink-2 hover:text-ink">
                  Masuk
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-line pt-6 text-meta text-ink-2">© 2026 EssayFlow. Hak cipta dilindungi.</p>
      </Container>
    </footer>
  );
}
