'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { motionTokens } from '@/design/tokens';
import { cn } from '@/lib/cn';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several panels open at once. Default: one at a time. */
  multiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

export function Accordion({ items, multiple = false, defaultOpenIds = [], className }: AccordionProps) {
  const uid = useId();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) =>
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : multiple ? [...prev, id] : [id]));

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={`${uid}-trigger-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-panel-${item.id}`}
                onClick={() => toggle(item.id)}
                className="flex min-h-12 w-full items-center justify-between gap-4 py-4 text-left text-body font-medium hover:text-accent motion-reduce:transition-none"
              >
                <span>{item.title}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'size-5 shrink-0 text-ink-2 transition-transform duration-300 ease-ef-out motion-reduce:transition-none',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={`${uid}-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`${uid}-trigger-${item.id}`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : motionTokens.duration.base, ease: motionTokens.ease }}
                  className="overflow-hidden"
                >
                  <div className="max-w-copy-lg pb-6 text-body text-ink-2">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
