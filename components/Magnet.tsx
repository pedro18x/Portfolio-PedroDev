'use client';

import { motion, useSpring } from 'motion/react';
import React, { ReactNode, useEffect, useRef } from 'react';

interface MagnetProps {
  children: ReactNode;
  /** Margem (px) ao redor do elemento em que o magnetismo atua */
  padding?: number;
  /** Deslocamento máximo em px — sutileza é o efeito */
  maxShift?: number;
  className?: string;
}

/**
 * Atração magnética sutil (ideia de @react-bits/Magnet, reconstruída):
 * valores em useSpring — nenhum re-render por movimento, velocidade
 * preservada ao re-mirar (apple-design §3) — e escuta de ponteiro apenas
 * dentro da própria área acolchoada, não na janela inteira.
 * A estrutura do DOM é idêntica no servidor e no cliente (sem mismatch de
 * hidratação); toque e prefers-reduced-motion apenas desativam o gesto.
 */
export default function Magnet({
  children,
  padding = 12,
  maxShift = 3,
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useRef(false);

  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    enabled.current =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || !enabled.current) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const dx = e.clientX - (left + width / 2);
    const dy = e.clientY - (top + height / 2);
    const range = padding + Math.min(width, height) / 2;
    x.set(Math.max(-maxShift, Math.min(maxShift, (dx / range) * maxShift)));
    y.set(Math.max(-maxShift, Math.min(maxShift, (dy / range) * maxShift)));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: 'inline-block', padding, margin: -padding }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  );
}
