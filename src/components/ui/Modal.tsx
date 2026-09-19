'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { motionTokens } from '@/design/tokens';
import { cn } from '@/lib/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Dialog with focus containment, Escape handling and mobile-friendly full width. */
export function Modal({ open, onClose, title, description, children, footer, className }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : motionTokens.duration.fast }}
        >
          <button type="button" aria-label="Tutup dialog" onClick={onClose} className="absolute inset-0 bg-ink/40" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduce ? 0 : motionTokens.duration.base, ease: motionTokens.ease }}
            className={cn(
              'relative z-10 max-h-[90dvh] w-full overflow-y-auto rounded-t-lg border border-line bg-bg p-6 shadow-panel outline-none sm:max-w-lg sm:rounded-lg',
              className,
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sub text-ink">{title}</h2>
                {description && <p className="mt-2 text-body-sm text-ink-2">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-ink-2 transition-colors duration-200 hover:bg-muted hover:text-ink motion-reduce:transition-none"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            {children && <div className="mt-6">{children}</div>}
            {footer && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
