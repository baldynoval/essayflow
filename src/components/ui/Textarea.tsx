'use client';

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, containerClassName, id, rows = 5, ...props },
  ref,
) {
  const uid = useId();
  const areaId = id ?? `${uid}-textarea`;
  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label htmlFor={areaId} className="text-meta font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full rounded-sm border border-line bg-bg px-4 py-3 text-body-sm text-ink placeholder:text-ink-3',
          'transition-[border-color] duration-200 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 motion-reduce:transition-none',
          error && 'border-danger',
          className,
        )}
        {...props}
      />
      {error ? <p className="text-meta text-danger" role="alert">{error}</p> : hint && <p className="text-meta text-ink-2">{hint}</p>}
    </div>
  );
});
