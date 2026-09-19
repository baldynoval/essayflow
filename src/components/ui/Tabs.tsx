'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { motionTokens } from '@/design/tokens';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultId?: string;
  ariaLabel: string;
  className?: string;
}

export function Tabs({ items, defaultId, ariaLabel, className }: TabsProps) {
  const uid = useId();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((i) => i.id === active);
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else return;
    e.preventDefault();
    const id = items[next].id;
    setActive(id);
    refs.current[id]?.focus();
  };

  const current = items.find((i) => i.id === active) ?? items[0];

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className="-mx-5 flex gap-1 overflow-x-auto border-b border-line px-5 md:mx-0 md:px-0"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[item.id] = el;
              }}
              role="tab"
              type="button"
              id={`${uid}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              className={cn(
                'relative inline-flex h-12 shrink-0 items-center gap-2 px-4 text-body-sm font-medium transition-colors duration-200 motion-reduce:transition-none',
                selected ? 'text-ink' : 'text-ink-2 hover:text-ink',
              )}
            >
              {item.icon}
              {item.label}
              {selected && (
                <motion.span
                  layoutId={`${uid}-indicator`}
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent"
                  transition={reduce ? { duration: 0 } : { duration: motionTokens.duration.base, ease: motionTokens.ease }}
                />
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          role="tabpanel"
          id={`${uid}-panel-${current.id}`}
          aria-labelledby={`${uid}-tab-${current.id}`}
          tabIndex={0}
          className="pt-8 outline-offset-4"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: reduce ? 0 : motionTokens.duration.base, ease: motionTokens.ease }}
        >
          {current.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
