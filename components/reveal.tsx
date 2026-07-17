'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Revelação por entrada no viewport: subida curta com fade, uma única vez,
 * na mola do site. `data-reveal` permite neutralizar em @media print.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion();

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: 8 };
  const shown = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: '0px 0px -48px 0px' }}
      transition={{ type: 'spring', duration: 0.45, bounce: 0, delay }}
    >
      {children}
    </motion.div>
  );
}
