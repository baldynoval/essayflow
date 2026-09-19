import { cn } from '@/lib/cn';

type AvatarSize = 'sm' | 'md' | 'lg';

const sizes: Record<AvatarSize, string> = {
  sm: 'size-6 text-caption',
  md: 'size-8 text-meta',
  lg: 'size-10 text-body-sm',
};

function initials(name: string) {
  const words = name.replace(/^(Dr\.|Prof\.|Ir\.)\s*/i, '').trim().split(/\s+/);
  return ((words[0]?.[0] ?? '') + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
}

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

/** Photo avatar with initials fallback. */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const base = cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full', sizes[size], className);
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={cn(base, 'object-cover')} />;
  }
  return (
    <span role="img" aria-label={name} className={cn(base, 'bg-muted font-medium text-ink-2')}>
      {initials(name)}
    </span>
  );
}
