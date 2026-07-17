'use client';

import React, { useRef } from 'react';

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: string;
}

/**
 * Adaptado de @react-bits/SpotlightCard para o sistema do site: tema claro,
 * brilho monocromático discreto e posição escrita direto no estilo do
 * elemento (nenhum re-render por movimento de ponteiro — regra de
 * performance do emil-design-eng).
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'color-mix(in srgb, var(--foreground) 6%, transparent)',
}: SpotlightCardProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent) {
    const host = hostRef.current;
    const glow = glowRef.current;
    if (!host || !glow) return;
    const rect = host.getBoundingClientRect();
    glow.style.background = `radial-gradient(140px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, ${spotlightColor}, transparent 75%)`;
    glow.style.opacity = '1';
  }

  function onLeave() {
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }

  return (
    <div
      ref={hostRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative overflow-hidden rounded-[inherit] ${className}`}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
