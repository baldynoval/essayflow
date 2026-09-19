'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { motionTokens } from '@/design/tokens';

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/** Subtle in-view entrance. Renders statically when the user prefers reduced motion. */
export function Reveal({ children, delay = 0, y = 12, className }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease, delay }}
    >
      {children}
    </motion.div>
  );
}
