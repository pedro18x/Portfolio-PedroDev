import Image from 'next/image';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { ProjectItem } from '@/lib/content';

/**
 * Link de projeto com "quick look": um hover-card acima do link mostra a
 * imagem do produto, uma linha de descrição e as tags. Origem da escala no
 * próprio gatilho (Base UI expõe --transform-origin). Em toque não há hover:
 * o link navega normalmente.
 */
export function ProjectLink({ item }: { item: ProjectItem }) {
  return (
    <li className="work-row text-[0.9375rem]">
      <HoverCard>
        <HoverCardTrigger
          render={
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.name}{' '}
              <span className="ext-arrow text-[0.85em] text-faint">↗</span>
            </a>
          }
        />
        <HoverCardContent side="top" sideOffset={10} className="w-72 p-3">
          {/* Prévia apenas: sem repetir a descrição que já está no gatilho.
              O contêiner mais largo que 2:1 corta a barra de linguagens
              multicolorida no rodapé das imagens OG do GitHub. */}
          <div className="aspect-[2.6/1] w-full overflow-hidden rounded-md border border-border">
            <Image
              src={item.image}
              alt={`${item.name} preview`}
              width={1200}
              height={630}
              className="size-full object-cover object-top"
            />
          </div>
          <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
            <span className="text-foreground">{item.name}</span>
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
        </HoverCardContent>
      </HoverCard>{' '}
      <span className="text-muted-foreground">{item.description}</span>
    </li>
  );
}
