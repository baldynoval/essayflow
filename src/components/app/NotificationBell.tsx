'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { ACTIVITIES } from '@/data/mock';
import { motionTokens } from '@/design/tokens';
import { formatDate, formatTime } from '@/lib/format';
import { cn } from '@/lib/cn';

/** Notification list with read/unread state. No “mark all as read” (not in the reference). */
export function NotificationBell() {
  const [items, setItems] = useState(ACTIVITIES);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const unread = items.filter((item) => !item.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={unread > 0 ? `Notifikasi, ${unread} belum dibaca` : 'Notifikasi'}
        className="relative inline-flex size-10 items-center justify-center rounded-sm text-ink-2 transition-colors duration-200 hover:bg-muted hover:text-ink motion-reduce:transition-none"
      >
        <Bell className="size-4" aria-hidden />
        {unread > 0 && (
          <span
            aria-hidden
            className="absolute right-2 top-2 inline-flex size-2 items-center justify-center rounded-full bg-accent"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button type="button" aria-hidden tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-40 cursor-default" />
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : motionTokens.duration.fast, ease: motionTokens.ease }}
              className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-md border border-line bg-bg shadow-panel"
            >
              <p className="border-b border-line px-4 py-3 text-meta font-medium text-ink">Notifikasi</p>
              <ul className="max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setItems((current) => current.map((n) => (n.id === item.id ? { ...n, read: true } : n)))
                      }
                      className={cn(
                        'flex w-full flex-col items-start gap-1 border-b border-line px-4 py-3 text-left transition-colors duration-200 hover:bg-muted motion-reduce:transition-none',
                        !item.read && 'bg-accent-soft/40',
                      )}
                    >
                      <span className="flex w-full items-start gap-2">
                        {!item.read && <span aria-hidden className="mt-1 size-2 shrink-0 rounded-full bg-accent" />}
                        <span className="text-meta font-medium text-ink">{item.title}</span>
                      </span>
                      <span className="text-caption text-ink-2">{item.description}</span>
                      <span className="text-caption text-ink-3">
                        {formatDate(item.at)}, {formatTime(item.at)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
