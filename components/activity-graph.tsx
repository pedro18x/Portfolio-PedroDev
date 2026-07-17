"use client";

import { PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import type { ContributionData, GithubProfile } from "@/lib/github";
import { site } from "@/lib/content";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import SpotlightCard from "./SpotlightCard";
import { RollingDigits } from "./rolling-digits";
import { Section } from "./section";

/*
 * A PLACA DE IMPRESSÃO (plano B do torneio de componentes): o ano do GitHub
 * como uma chapa de meio-tom. Cada dia é um ponto de tinta circular cujo
 * RAIO codifica a contagem (dado como geometria, não opacidade). Na primeira
 * rolagem até aqui (uma vez por sessão), uma cabeça de impressão varre a
 * chapa e seis meses de trabalho se materializam coluna a coluna, com o
 * odômetro do total pousando em sincronia. Depois, a tinta incha sob o
 * cursor (modelo de proximidade do @react-bits/DotGrid, reimplementado nos
 * tokens do site, sem gsap) e o clique no monograma "pe" ondula a chapa
 * também: duas placas, uma tinta.
 *
 * Movimento reduzido: chapa já impressa, contadores estáticos, tooltip
 * intacto. Acessibilidade: canvas oculto de leitores; resumo textual ao lado.
 */
const WEEKS = 26;
const SWEEP_MS = 1100;
const SWELL_RADIUS = 70;

/** sessionStorage pode LANÇAR com cookies bloqueados; falha = não impresso. */
function readPrinted(): boolean {
  try {
    return sessionStorage.getItem("plate-printed") === "1";
  } catch {
    return false;
  }
}
function markPrinted() {
  try {
    sessionStorage.setItem("plate-printed", "1");
  } catch {
    /* sem storage a varredura apenas repete na próxima visita */
  }
}

interface DayTip {
  text: string;
  x: number;
  y: number;
}

/** Contagem exata do dia: campo do GraphQL ou parse do label do scrape. */
function countOf(day: { count?: number; label?: string }): number {
  if (typeof day.count === "number") return day.count;
  const m = day.label?.match(/^(\d+)/);
  return m ? Number(m[1]) : 0;
}

function StatValue({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setShown(value);
      return;
    }
    const controls = animate(0, value, {
      type: "spring",
      duration: 0.8,
      bounce: 0,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  return (
    <span
      ref={ref}
      className="font-mono text-[0.8125rem] text-foreground [font-variant-numeric:tabular-nums]"
    >
      {shown}
      {suffix}
    </span>
  );
}

export function ActivityGraph({
  initial,
  profile,
}: {
  initial: ContributionData | null;
  profile: GithubProfile | null;
}) {
  const [data, setData] = useState(initial);
  const [tip, setTip] = useState<DayTip | null>(null);
  const reduced = useReducedMotion();

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Odômetro do total: zera antes da varredura, rola 1100ms em sincronia
  const total = data?.total ?? "0";
  const [display, setDisplay] = useState(total);
  const [rollMs, setRollMs] = useState(0);
  const printedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/contributions", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((fresh: ContributionData | null) => {
        if (!cancelled && fresh?.days?.length) {
          setData(fresh);
          // Depois de impressa, o valor vivo rola do valor exibido
          if (printedRef.current) {
            setRollMs(480);
            setDisplay(fresh.total);
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- geometria da chapa ----
  // Alinhar a janela ao domingo descartando dias à esquerda: sem isso a
  // grade precisa de firstWeekday células extras, a última coluna vira a
  // 27ª e os dias MAIS RECENTES (inclusive hoje) caem fora do canvas em
  // 6 de cada 7 semanas.
  const days = data?.days ?? [];
  const windowDays = days.slice(-(WEEKS * 7));
  const lead = windowDays.length
    ? (7 - new Date(`${windowDays[0].date}T00:00:00Z`).getUTCDay()) % 7
    : 0;
  const recent = windowDays.slice(lead);

  const stateRef = useRef({
    progress: 1, // 0..1 durante a varredura
    sweeping: false,
    sweepStart: 0,
    pointer: { x: -1e4, y: -1e4 },
    swell: new Map<number, number>(),
    ripple: null as { x: number; y: number; t: number } | null,
    raf: 0,
  });

  // desenho: dimensões derivadas do wrapper; células quadradas fluidas
  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!wrap || !cv || !ctx || !recent.length) return;

    const st = stateRef.current;
    let W = 0;
    let H = 0;
    let pitch = 0;

    function fit() {
      const rect = wrap!.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = rect.width;
      pitch = W / WEEKS;
      H = pitch * 7;
      wrap!.style.height = `${H}px`;
      cv!.width = W * dpr;
      cv!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const counts = recent.map(countOf);
    const maxCount = Math.max(1, ...counts);

    function dotAt(i: number) {
      const col = Math.floor(i / 7);
      const row = i % 7;
      return {
        x: col * pitch + pitch / 2,
        y: row * pitch + pitch / 2,
      };
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, W, H);
      const limit = st.progress * (W + 50);
      for (let i = 0; i < recent.length; i++) {
        const { x, y } = dotAt(i);
        if (x > limit) continue;
        const c = counts[i];
        const frac = Math.min(c, maxCount) / maxCount;
        // raio codifica contagem; dias vazios são um picote fixo
        let r = c === 0 ? pitch * 0.06 : pitch * (0.13 + frac * 0.27);
        let a = c === 0 ? 0.14 : 0.35 + frac * 0.65;

        // pop de chegada logo atrás da cabeça de impressão
        const sincePass = Math.min(1, (limit - x) / 60);
        if (st.sweeping && sincePass < 1) {
          r *= 1 + 0.18 * Math.sin(Math.PI * sincePass);
          a *= 0.4 + 0.6 * sincePass;
        }

        // inchaço sob o ponteiro, com atraso de mola
        const swell = st.swell.get(i) ?? 0;
        if (swell > 0.005) {
          r *= 1 + swell * 0.5;
          a = Math.min(1, a + swell * 0.2);
        }

        // ondulação vinda do monograma
        if (st.ripple) {
          const age = now - st.ripple.t;
          if (age < 700) {
            const ring = age * 0.35;
            const d = Math.hypot(x - st.ripple.x, y - st.ripple.y);
            const band = Math.exp(-((d - ring) * (d - ring)) / 400) * (1 - age / 700);
            r += band * pitch * 0.12;
            a = Math.min(1, a + band * 0.35);
          }
        }

        ctx!.fillStyle = `rgba(17,17,17,${Math.min(1, a).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(x, y, Math.max(0.4, r), 0, 7);
        ctx!.fill();
      }
      if (st.sweeping && st.progress < 1) {
        ctx!.strokeStyle = "#111111";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(limit + 0.5, 3);
        ctx!.lineTo(limit + 0.5, H - 3);
        ctx!.stroke();
      }
    }

    function frame(now: number) {
      st.raf = 0;
      let needMore = false;

      if (st.sweeping) {
        st.progress = Math.min(1, (now - st.sweepStart) / SWEEP_MS);
        if (st.progress >= 1) st.sweeping = false;
        else needMore = true;
      }

      for (let i = 0; i < recent.length; i++) {
        const { x, y } = dotAt(i);
        const d = Math.hypot(x - st.pointer.x, y - st.pointer.y);
        const target = Math.max(0, 1 - d / SWELL_RADIUS);
        const cur = st.swell.get(i) ?? 0;
        const next = cur + (target - cur) * 0.18;
        if (next > 0.003) {
          st.swell.set(i, next);
          if (Math.abs(target - next) > 0.01) needMore = true;
        } else {
          st.swell.delete(i);
        }
      }

      if (st.ripple && now - st.ripple.t < 700) needMore = true;
      else if (st.ripple) st.ripple = null;

      draw(now);
      if (needMore) st.raf = requestAnimationFrame(frame);
    }
    function kick() {
      if (!st.raf) st.raf = requestAnimationFrame(frame);
    }

    const resize = new ResizeObserver(() => {
      fit();
      draw(performance.now());
    });
    resize.observe(wrap);
    fit();
    draw(performance.now());

    // varredura: uma vez por sessão, na primeira entrada em vista
    let io: IntersectionObserver | null = null;
    const already = reduced || readPrinted();
    if (already) {
      // Reexecuções do efeito (setData ao vivo no meio da varredura) caem
      // aqui: zerar o estado persistente da varredura, senão a chapa
      // congela meio impressa com a régua parada e sem rAF agendado.
      st.progress = 1;
      st.sweeping = false;
      // Só reancorar o odômetro na primeira passagem; numa reexecução o
      // handler do fetch já armou o rolo de 480ms do valor exibido.
      if (!printedRef.current) {
        setRollMs(0);
        setDisplay(total);
      }
      printedRef.current = true;
      draw(performance.now());
    } else {
      st.progress = 0;
      setRollMs(0);
      setDisplay(total.replace(/\d/g, "0"));
      draw(performance.now());
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io?.disconnect();
          markPrinted();
          printedRef.current = true;
          st.sweeping = true;
          st.sweepStart = performance.now();
          setRollMs(SWEEP_MS);
          setDisplay(total);
          kick();
        },
        { threshold: 0.5 },
      );
      io.observe(wrap);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      st.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      kick();
    }
    function onPointerLeave() {
      st.pointer = { x: -1e4, y: -1e4 };
      kick();
    }
    // ponte de choque: clicar no monograma "pe" ondula a chapa também
    function onInk(e: Event) {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      const rect = wrap!.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      st.ripple = {
        x: x - rect.left,
        y: y - rect.top,
        t: performance.now(),
      };
      kick();
    }

    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pe-ink", onInk);

    return () => {
      cancelAnimationFrame(st.raf);
      st.raf = 0;
      resize.disconnect();
      io?.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pe-ink", onInk);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, reduced]);

  if (!data || !recent.length) return null;

  // ---- tooltip por matemática de célula (um único elemento) ----
  function onTipMove(event: ReactPointerEvent<HTMLDivElement>) {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const pitch = rect.width / WEEKS;
    const col = Math.floor((event.clientX - rect.left) / pitch);
    const row = Math.floor((event.clientY - rect.top) / pitch);
    const i = col * 7 + row;
    const day = recent[i];
    if (col < 0 || col >= WEEKS || row < 0 || row > 6 || !day) {
      setTip(null);
      return;
    }
    const HALF_TIP = 96;
    const rawX = col * pitch + pitch / 2;
    setTip({
      text: day.label ?? day.date,
      x: Math.min(Math.max(rawX, HALF_TIP), rect.width - HALF_TIP),
      y: row * pitch,
    });
  }

  // ---- estatísticas reais derivadas do mesmo payload ----
  const counts = recent.map(countOf);
  const hasCounts = counts.some((c) => c > 0);
  let streak = 0;
  let best = 0;
  let current = 0;
  for (const c of counts) {
    current = c > 0 ? current + 1 : 0;
    streak = Math.max(streak, current);
    best = Math.max(best, c);
  }
  let activeWeeks = 0;
  for (let w = 0; w < WEEKS; w++) {
    const start = w * 7;
    if (counts.slice(start, start + 7).some((c) => c > 0)) activeWeeks++;
  }

  // O cabeçalho ACTIVITY mora aqui (não na página): se o snapshot e o
  // fallback ao vivo falharem, some a seção inteira, não só o miolo.
  return (
    <Section label="Activity" id="activity">
      <a
        href={site.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open my GitHub profile"
        className="plain work-row block"
      >
        <p className="font-mono text-[2.375rem] font-medium leading-none text-foreground [font-variant-numeric:tabular-nums]">
          <RollingDigits value={display} durationMs={rollMs} />
        </p>
        <p className="mt-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
          <HoverCard>
            <HoverCardTrigger
              render={
                <span>
                  contributions in the last year <span className="ext-arrow text-[0.85em]">↗</span>
                </span>
              }
            />
            <HoverCardContent side="top" sideOffset={10} className="w-64 p-0">
              <SpotlightCard className="p-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-[0.8125rem] font-semibold tracking-[-0.03em] text-primary-foreground"
                  >
                    pe
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      @{site.githubUser}
                    </span>
                    <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
                      github.com ↗
                    </span>
                  </span>
                </div>
                {profile && (
                  <p className="mt-3 font-mono text-[0.75rem] text-muted-foreground [font-variant-numeric:tabular-nums]">
                    {profile.repos} public repos
                    <span aria-hidden="true" className="px-1.5 text-softline">
                      ·
                    </span>
                    {profile.followers} followers
                  </p>
                )}
                {/* legenda reensina a codificação: raio = contagem */}
                <span className="mt-3 inline-flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-[5px] rounded-full bg-foreground/40" />
                  <span className="size-[9px] rounded-full bg-foreground/70" />
                  <span className="size-[13px] rounded-full bg-foreground" />
                </span>
              </SpotlightCard>
            </HoverCardContent>
          </HoverCard>
        </p>

        <div
          ref={wrapRef}
          className="relative mt-4"
          onPointerMove={onTipMove}
          onPointerLeave={() => setTip(null)}
        >
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
          <p className="sr-only">
            GitHub contribution activity, last {WEEKS} weeks: {total} contributions in the last
            year.
          </p>
          {tip && (
            <span
              role="presentation"
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 font-mono text-[0.6875rem] text-background"
              style={{ left: tip.x, top: tip.y - 6 }}
            >
              {tip.text}
            </span>
          )}
        </div>

        <p className="mt-3 flex items-baseline justify-between font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
          <span>radius encodes count</span>
          <span>last 6 months</span>
        </p>
      </a>

      {hasCounts && (
        <div className="mt-5 flex gap-8 border-t border-border pt-4">
          <div>
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.09em] text-faint">
              Longest streak
            </p>
            <StatValue value={streak} suffix=" days" />
          </div>
          <div>
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.09em] text-faint">
              Busiest day
            </p>
            <StatValue value={best} />
          </div>
          <div>
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.09em] text-faint">
              Active weeks
            </p>
            <StatValue value={activeWeeks} suffix={` of ${WEEKS}`} />
          </div>
        </div>
      )}
    </Section>
  );
}
