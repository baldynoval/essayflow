import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type CardVariant = 'default' | 'subtle' | 'flat';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'li';
  variant?: CardVariant;
  padding?: CardPadding;
  /** Adds hover elevation. Only use for cards that are actually interactive/linkable. */
  interactive?: boolean;
}

const variants: Record<CardVariant, string> = {
  default: 'border border-line bg-bg',
  subtle: 'bg-surface',
  flat: 'border border-line bg-surface',
};

const paddings: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ as: Tag = 'div', variant = 'default', padding = 'md', interactive, className, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-md',
        variants[variant],
        paddings[padding],
        interactive &&
          'transition-[box-shadow,transform,border-color] duration-300 ease-ef-out hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      )}
      {...props}
    />
  );
}
