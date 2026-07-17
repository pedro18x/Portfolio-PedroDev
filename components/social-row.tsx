'use client';

import Magnet from './Magnet';
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface SocialRowProps {
  github: string;
  linkedin: string;
  email: string;
}

const iconLinkClasses =
  'plain -m-1 block p-1 text-faint transition-colors duration-150 hover:text-foreground';

/**
 * Linha de ícones sociais: atração magnética sutil (≤3px, mola) e tooltips
 * com atraso inicial — abrir um deixa os vizinhos instantâneos (Base UI
 * agrupa via Provider), como manda a regra do emil-design-eng.
 */
export function SocialRow({ github, linkedin, email }: SocialRowProps) {
  const items = [
    { label: 'GitHub', href: github, external: true, Icon: GitHubIcon },
    { label: 'LinkedIn', href: linkedin, external: true, Icon: LinkedInIcon },
    { label: 'Email', href: `mailto:${email}`, external: false, Icon: MailIcon },
  ];

  return (
    <TooltipProvider delay={500}>
      <div className="mt-5 flex items-center gap-3">
        {items.map(({ label, href, external, Icon }) => (
          <Tooltip key={label}>
            <Magnet padding={12} maxShift={3}>
              {/* nativeButton não existe no Trigger de Tooltip desta versão do
                  Base UI (gatilho de hover/focus, não de ação) — o render de
                  <a> mantém a semântica correta por si só. */}
              <TooltipTrigger
                render={
                  <a
                    href={href}
                    aria-label={label}
                    className={iconLinkClasses}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    <Icon className="size-5" />
                  </a>
                }
              />
            </Magnet>
            <TooltipContent className="font-mono text-[0.6875rem] uppercase tracking-[0.08em]">
              {label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
