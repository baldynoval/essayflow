import type { Metadata } from 'next';
import { Accordion } from '@/components/ui/Accordion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FAQ_ITEMS } from '@/data/landing';

export const metadata: Metadata = { title: 'FAQ — EssayFlow' };

export default function FAQPage() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading title="Pertanyaan yang Sering Diajukan" description="Penjelasan singkat mengenai cara kerja EssayFlow." as="h1" />
      <Accordion items={FAQ_ITEMS.map((item) => ({ id: item.id, title: item.title, content: <p className="text-body-sm text-ink-2">{item.content}</p> }))} />
    </div>
  );
}
