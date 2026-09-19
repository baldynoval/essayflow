'use client';

import { Search } from 'lucide-react';
import { useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  containerClassName?: string;
}

export function SearchInput({ label, className, containerClassName, id, ...props }: SearchInputProps) {
  const uid = useId();
  const inputId = id ?? `${uid}-search`;
  return (
    <div className={cn('relative', containerClassName)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
      <input
        id={inputId}
        type="search"
        className={cn(
          'h-10 w-full rounded-sm border border-line bg-bg pl-12 pr-4 text-body-sm text-ink placeholder:text-ink-3',
          'transition-[border-color] duration-200 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 motion-reduce:transition-none',
          className,
        )}
        {...props}
      />
    </div>
  );
}
