'use client';

import { ChevronDown } from 'lucide-react';
import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, className, containerClassName, id, children, ...props },
  ref,
) {
  const uid = useId();
  const selectId = id ?? `${uid}-select`;
  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-meta font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-12 w-full appearance-none rounded-sm border border-line bg-bg pl-4 pr-12 text-body-sm text-ink',
            'transition-[border-color] duration-200 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 motion-reduce:transition-none',
            error && 'border-danger',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
      </div>
      {error ? <p className="text-meta text-danger" role="alert">{error}</p> : hint && <p className="text-meta text-ink-2">{hint}</p>}
    </div>
  );
});
