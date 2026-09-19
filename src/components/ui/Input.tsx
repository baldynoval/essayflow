'use client';

import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  /** Rendered on the same line as the label, right-aligned (e.g. “Lupa Password?”). */
  labelAddon?: ReactNode;
  hint?: string;
  error?: string;
  iconLeft?: ReactNode;
  /** Adds a show/hide toggle. Keep `type="password"`. */
  revealable?: boolean;
  containerClassName?: string;
}

export const inputClasses =
  'h-12 w-full rounded-sm border border-line bg-bg px-4 text-body-sm text-ink placeholder:text-ink-3 ' +
  'transition-[border-color,box-shadow] duration-200 ease-ef-out ' +
  'hover:border-ink/20 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 ' +
  'disabled:cursor-not-allowed disabled:bg-surface disabled:text-ink-3 motion-reduce:transition-none';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, labelAddon, hint, error, iconLeft, revealable, className, containerClassName, id, type = 'text', ...props },
  ref,
) {
  const uid = useId();
  const inputId = id ?? `${uid}-input`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const [revealed, setRevealed] = useState(false);

  const resolvedType = revealable ? (revealed ? 'text' : 'password') : type;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      {label && (
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={inputId} className="text-meta font-medium text-ink">
            {label}
          </label>
          {labelAddon}
        </div>
      )}

      <div className="relative">
        {iconLeft && (
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            inputClasses,
            iconLeft && 'pl-12',
            revealable && 'pr-12',
            error && 'border-danger focus:border-danger focus:ring-danger/10',
            className,
          )}
          {...props}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? 'Sembunyikan password' : 'Tampilkan password'}
            aria-pressed={revealed}
            className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-sm text-ink-3 transition-colors duration-200 hover:bg-muted hover:text-ink motion-reduce:transition-none"
          >
            {revealed ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-meta text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-meta text-ink-2">
            {hint}
          </p>
        )
      )}
    </div>
  );
});
