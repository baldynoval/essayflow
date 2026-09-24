import type { Metadata } from 'next';
import { ContactForm } from '@/components/marketing/ContactForm';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Kontak — EssayFlow' };

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading title="Kontak" description="Kirim pertanyaan atau kendala teknis kepada tim EssayFlow." as="h1" />
      <ContactForm />
    </div>
  );
}
