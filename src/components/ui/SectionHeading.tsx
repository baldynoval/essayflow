import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SectionHeadingProps {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export function SectionHeading({ id, title, description, align = 'left', as: Tag = 'h2', className }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-copy-lg', align === 'center' && 'mx-auto text-center', className)}>
      <Tag id={id} className="text-section text-balance">
        {title}
      </Tag>
      {description && <p className="mt-4 text-body-lg text-ink-2 text-pretty">{description}</p>}
    </div>
  );
}
