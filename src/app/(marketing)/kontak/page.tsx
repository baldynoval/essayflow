import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Textarea } from '@/components/ui/Textarea';

export const metadata: Metadata = { title: 'Kontak — EssayFlow' };

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading title="Kontak" description="Kirim pertanyaan atau kendala teknis kepada tim EssayFlow." as="h1" />
      <form className="flex flex-col gap-5">
        <Input label="Nama" required />
        <Input label="Email" type="email" required />
        <Textarea label="Pesan" rows={6} required />
        <Button type="submit" size="lg" className="self-start">
          Kirim Pesan
        </Button>
      </form>
    </div>
  );
}
