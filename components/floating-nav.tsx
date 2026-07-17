'use client';

import { useEffect, useState } from 'react';

/**
 * Barra de navegação flutuante em material translúcido (apple-design §12).
 * Só aparece depois que o cabeçalho da página sai de vista — um
 * IntersectionObserver no <header> controla a visibilidade; a mola e o
 * caminho de entrada/saída vivem no CSS (.fnav em globals.css).
 */
export function FloatingNav({
  name,
  github,
  linkedin,
}: {
  name: string;
  github: string;
  linkedin: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '-8px 0px 0px 0px' },
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    // Só em telas estreitas: no desktop o rail está sempre visível
    <nav
      className="fnav md:hidden"
      data-visible={visible}
      aria-label="Quick navigation"
    >
      <div className="fnav-inner mx-auto flex max-w-page items-baseline justify-between gap-4 px-6 py-3.5 text-[0.8125rem]">
        {/* Chrome quieto: links da barra sem sublinhado, só variação de cor */}
        <a href="#top" className="plain">
          {name}
        </a>
        <span className="flex items-baseline gap-4 font-mono text-[0.75rem]">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="plain wecho text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="plain wecho text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href="#contact"
            className="plain wecho text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            Contact
          </a>
        </span>
      </div>
    </nav>
  );
}
