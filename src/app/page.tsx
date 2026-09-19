import { MarketingFooter } from '@/components/layout/MarketingFooter';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { AIShowcase } from '@/components/marketing/AIShowcase';
import { Benefits } from '@/components/marketing/Benefits';
import { FAQ } from '@/components/marketing/FAQ';
import { Features } from '@/components/marketing/Features';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { Hero } from '@/components/marketing/Hero';
import { ProductPreview } from '@/components/marketing/ProductPreview';
import { ReviewShowcase } from '@/components/marketing/ReviewShowcase';
import { Workflow } from '@/components/marketing/Workflow';

export default function LandingPage() {
  return (
    <>
      <TopNavigation />
      <main id="konten-utama">
        <Hero />
        <ProductPreview />
        <Workflow />
        <AIShowcase />
        <ReviewShowcase />
        <Features />
        <Benefits />
        <FAQ />
        <FinalCTA />
      </main>
      <MarketingFooter />
    </>
  );
}
