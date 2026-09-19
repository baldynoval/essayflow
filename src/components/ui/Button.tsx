import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children?: ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };
type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | 'href'> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-ef-out ' +
  'active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100 ' +
  'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-bg hover:bg-ink/85',
  secondary: 'border border-line bg-bg text-ink hover:border-ink/25 hover:bg-surface',
  ghost: 'text-ink hover:bg-muted',
  accent: 'bg-accent text-on-accent hover:bg-accent/90',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-meta',
  md: 'h-10 px-4 text-body-sm',
  lg: 'h-12 px-6 text-body',
};

export function buttonClasses(
  { variant = 'primary', size = 'md', fullWidth, className }: Pick<BaseProps, 'variant' | 'size' | 'fullWidth' | 'className'>,
) {
  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { href, variant, size, loading, fullWidth, iconLeft, iconRight, className, children, ...anchor } =
      props as ButtonAsLink;
    return (
      <Link
        href={href}
        className={buttonClasses({ variant, size, fullWidth, className })}
        aria-busy={loading || undefined}
        {...anchor}
      >
        {iconLeft}
        {children}
        {iconRight}
      </Link>
    );
  }

  const {
    variant, size, loading, fullWidth, iconLeft, iconRight, className, children,
    type = 'button', disabled, ...button
  } = props as ButtonAsButton;

  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...button}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}
