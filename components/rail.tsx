"use client";

import { useEffect, useState } from "react";
import { Monogram } from "./monogram";
import { RollingDigits } from "./rolling-digits";
import { SocialRow } from "./social-row";

interface RailProps {
  name: string;
  role: string;
  thesis: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
}

/** Relógio de João Pessoa, vivo. Vazio no servidor; preenche após montar. */
function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/Fortaleza",
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return <span> </span>;
  return <RollingDigits value={time} className="text-foreground" durationMs={300} />;
}

/**
 * Coluna fixa de identidade: nome, tese, o monograma 3D interativo
 * preenchendo o vão, e o rodapé com hora local, foco atual, meta e
 * sociais. Em telas estreitas vira cabeçalho estático (sem monograma);
 * a navegação fica por conta da barra flutuante.
 */
export function Rail({ name, role, thesis, location, email, github, linkedin }: RailProps) {
  return (
    <aside
      id="site-header"
      className="flex flex-col border-b border-border pb-8 pt-14 md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-b-0 md:border-r md:pb-12 md:pr-12 md:pt-20"
    >
      {/* Lockup em duas linhas (plano B): massa tipográfica estática com
          eco de peso no hover — a tinta engrossa sob a mão */}
      <h1 className="wecho-big text-[2.125rem] font-semibold leading-[1.05] tracking-[-0.02em]">
        {name.split(" ").map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </h1>
      <p className="mt-1.5 text-muted-foreground">{role}</p>
      <p className="mt-5 max-w-[15rem] text-[0.9375rem] text-muted-foreground">{thesis}</p>

      <Monogram />

      <div className="mt-8 flex flex-col gap-4 md:mt-0">
        <div className="flex max-w-[15rem] flex-col gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint [font-variant-numeric:tabular-nums]">
          <p className="flex items-baseline justify-between gap-4">
            <span>Local time</span>
            <LocalTime />
          </p>
          <p className="flex items-baseline justify-between gap-4">
            <span>Now</span>
            <span className="text-foreground">Building Maestro</span>
          </p>
        </div>
        <SocialRow github={github} linkedin={linkedin} email={email} />
        <p className="font-mono text-[0.75rem] leading-relaxed text-faint">
          {location}
          <br />
          <a href={`mailto:${email}`} className="plain hover:text-foreground">
            {email}
          </a>
        </p>
        <p className="font-mono text-[0.75rem] text-faint [font-variant-numeric:tabular-nums]">
          © 2026
        </p>
      </div>
    </aside>
  );
}
