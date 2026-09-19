import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** content = 1280px (application), marketing = 1400px (landing sections) */
  size?: 'content' | 'marketing';
}

export function Container({ size = 'content', className, ...props }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-5 md:px-8 lg:px-10', size === 'content' ? 'max-w-content' : 'max-w-marketing', className)}
      {...props}
    />
  );
}
