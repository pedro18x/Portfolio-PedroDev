import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import type { TimelineEntry } from '@/lib/content';

/**
 * Lista de experiência expansível: recolhida mostra cargo/empresa/período e
 * um resumo de uma linha; clicar na linha abre os detalhes com mola.
 * Sem cromo: o indicador é um "+" de fios de tinta cuja barra vertical gira
 * 90° ao abrir (vira "−"), na mola do site. Detalhes abertos são parágrafos
 * limpos, um degrau menor que o resumo — sem marcadores, sem réguas.
 * Entradas sem bullets são estáticas (nada finge ser expansível).
 */
function PlusMinus() {
  return (
    <span
      aria-hidden="true"
      className="relative mt-1 size-3 shrink-0 self-center text-softline transition-colors duration-150 group-hover/exp:text-foreground"
    >
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rounded-full bg-current" />
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 rounded-full bg-current transition-transform duration-[272ms] [transition-timing-function:var(--spring)] group-aria-expanded/exp:rotate-90 motion-reduce:transition-none" />
    </span>
  );
}

export function ExperienceList({ entries }: { entries: TimelineEntry[] }) {
  const expandable = entries.filter((e) => e.bullets?.length);
  const defaultOpen = expandable.length ? [expandable[0].org] : [];

  return (
    <Accordion defaultValue={defaultOpen} multiple className="gap-7">
      {entries.map((entry) =>
        entry.bullets?.length ? (
          <AccordionItem
            key={entry.org}
            value={entry.org}
            className="not-last:border-0"
          >
            <div className="grid gap-x-6 @lg:grid-cols-[10rem_1fr]">
              <span className="pt-0.5 font-mono text-[0.8125rem] text-faint [font-variant-numeric:tabular-nums]">
                {entry.period}
              </span>
              <div>
                {/* O Header do Base UI já é o heading — dentro do botão, só phrasing content */}
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="press group/exp flex w-full items-baseline justify-between gap-4 text-left transition-opacity duration-150">
                    <span className="text-[0.9375rem] font-semibold">
                      {entry.title}
                      <span className="font-normal text-muted-foreground">
                        , {entry.org}
                      </span>
                    </span>
                    <PlusMinus />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <p className="mt-1 text-[0.9375rem] text-muted-foreground">
                  {entry.summary}
                </p>
                <AccordionContent className="p-0">
                  <ul className="mt-2.5 flex list-none flex-col gap-2 pb-1 text-[0.875rem] leading-relaxed text-muted-foreground">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </div>
            </div>
          </AccordionItem>
        ) : (
          <div
            key={entry.org}
            className="grid gap-x-6 gap-y-1 @lg:grid-cols-[10rem_1fr]"
          >
            <span className="pt-0.5 font-mono text-[0.8125rem] text-faint [font-variant-numeric:tabular-nums]">
              {entry.period}
            </span>
            <div>
              <h3 className="text-[0.9375rem] font-semibold">
                {entry.title}
                <span className="font-normal text-muted-foreground">
                  , {entry.org}
                </span>
              </h3>
              {entry.description && (
                <p className="mt-1 text-[0.9375rem] text-muted-foreground">
                  {entry.description}
                </p>
              )}
            </div>
          </div>
        ),
      )}
    </Accordion>
  );
}
