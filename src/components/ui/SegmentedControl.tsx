'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { motionTokens } from '@/design/tokens';
import { cn } from '@/lib/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

/**
 * Compact two-or-three way switch (used for the Pengajar / Mahasiswa role choice).
 * Distinct from `Tabs`, which swaps whole content panels.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const uid = useId();
  const reduce = useReducedMotion();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = options.findIndex((option) => option.value === value);
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % options.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + options.length) % options.length;
    else return;
    event.preventDefault();
    const target = options[next].value;
    onChange(target);
    refs.current[target]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn('flex gap-1 rounded-sm bg-muted p-1', className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(element) => {
              refs.current[option.value] = element;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-sm text-body-sm font-medium transition-colors duration-200 motion-reduce:transition-none',
              selected ? 'text-ink' : 'text-ink-2 hover:text-ink',
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${uid}-thumb`}
                aria-hidden
                className="absolute inset-0 rounded-sm bg-bg shadow-soft"
                transition={reduce ? { duration: 0 } : { duration: motionTokens.duration.base, ease: motionTokens.ease }}
              />
            )}
            <span className="relative inline-flex items-center gap-2">
              {option.icon}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
