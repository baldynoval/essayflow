'use client';

import { cn } from '@/lib/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

/** Accessible switch used for task settings and notification preferences. */
export function Toggle({ checked, onChange, label, description, disabled, className }: ToggleProps) {
  return (
    <label className={cn('flex cursor-pointer items-start justify-between gap-4', disabled && 'cursor-not-allowed opacity-50', className)}>
      <span className="min-w-0">
        <span className="block text-body-sm text-ink">{label}</span>
        {description && <span className="mt-1 block text-meta text-ink-2">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-1 inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-200 motion-reduce:transition-none',
          checked ? 'bg-accent' : 'bg-muted',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'inline-block size-4 rounded-full bg-bg shadow-soft transition-transform duration-200 motion-reduce:transition-none',
            checked ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </button>
    </label>
  );
}
