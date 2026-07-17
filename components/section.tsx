import type { ReactNode } from 'react';

interface SectionProps {
  label: string;
  id?: string;
  children: ReactNode;
}

/**
 * Seção do conteúdo aberto do cartão, com rótulo em caixa alta.
 * (A entrada da página é do cartão inteiro; seções não animam individualmente.)
 */
export function Section({ label, id, children }: SectionProps) {
  const headingId = `${label.toLowerCase().replace(/\s+/g, '-')}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="mt-14 scroll-mt-16">
      <h2
        id={headingId}
        className="wecho mb-5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-faint"
      >
        {label}
      </h2>
      {children}
    </section>
  );
}
