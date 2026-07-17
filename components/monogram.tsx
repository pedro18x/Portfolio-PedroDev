"use client";

import { useEffect, useRef } from "react";

/*
 * Monograma "pe" como placa de pixels — a mesma linguagem de células do
 * calendário de contribuições (quadrados arredondados, rampa de cinzas),
 * zero dependências. O glifo é amostrado de um canvas offscreen (na Geist
 * real, após document.fonts.ready) numa grade grossa; cada célula tem uma
 * intensidade própria e um brilho que oscila muito lentamente.
 *
 * Interações (só quando o usuário causa): a tinta escurece sob o cursor
 * com decaimento suave; clicar dispara uma ondulação que atravessa a
 * placa. Movimento reduzido: placa estática, hover e clique continuam
 * (movimento iniciado pelo usuário), sem shimmer. O loop pausa com a aba
 * oculta e com a placa fora de vista (display:none no mobile).
 */
const STEP = 10; // passo da grade no sampler 320x220
const GAP = 2.4; // vão entre células (unidades do sampler)
const HOVER_RADIUS = 80; // px de canvas
const RIPPLE_LIFE = 900; // ms

// Rampa de tinta pré-computada: evita alocar strings rgba() por célula
// a cada quadro.
const SHADES = 64;
const INK = Array.from(
  { length: SHADES },
  (_, i) => `rgba(17,17,17,${(i / (SHADES - 1)).toFixed(3)})`,
);

interface Cell {
  x: number;
  y: number;
  h: number; // hash 0..1: intensidade base e fase do shimmer
  cur: number; // intensidade atual (suavizada por quadro)
}

interface Ripple {
  x: number;
  y: number;
  t: number;
}

export function Monogram() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!stage || !cv || !ctx) return;

    // a preferência pode mudar no meio da sessão: `let` + assinatura do mq
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;

    let W = 0;
    let H = 0;
    function fit() {
      const rect = stage!.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      cv!.width = W * dpr;
      cv!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let cells: Cell[] = [];
    function build() {
      const off = document.createElement("canvas");
      off.width = 320;
      off.height = 220;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.font = `700 170px ${getComputedStyle(document.body).fontFamily}`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText("pe", 160, 118);
      const img = octx.getImageData(0, 0, off.width, off.height);

      cells = [];
      for (let y = 0, gy = 0; y < off.height; y += STEP, gy++) {
        for (let x = 0, gx = 0; x < off.width; x += STEP, gx++) {
          if (img.data[(y * off.width + x) * 4 + 3] > 128) {
            const h = Math.abs((Math.sin(gx * 127.1 + gy * 311.7) * 43758.5453) % 1);
            cells.push({
              x: x - 160 + STEP / 2,
              y: y - 110 + STEP / 2,
              h,
              cur: 0,
            });
          }
        }
      }
    }

    let pointer: { x: number; y: number } | null = null;
    const ripples: Ripple[] = [];

    function draw(t: number) {
      ctx!.clearRect(0, 0, W, H);
      if (!cells.length || W === 0 || H === 0) return;
      const S = Math.min(W / 340, H / 250);
      const size = (STEP - GAP) * S;
      const radius = GAP * S;
      const round = "roundRect" in ctx!;

      for (let i = ripples.length - 1; i >= 0; i--) {
        if (t - ripples[i].t > RIPPLE_LIFE) ripples.splice(i, 1);
      }

      for (const cell of cells) {
        const px = W / 2 + cell.x * S;
        const py = H / 2 + cell.y * S;
        // rampa base + shimmer lento; hover e ondulações somam por cima
        let target =
          0.42 + 0.34 * cell.h + (reduced ? 0 : 0.08 * Math.sin(t * 0.0005 + cell.h * 6.283));
        if (pointer) {
          const d = Math.hypot(px - pointer.x, py - pointer.y);
          target += Math.max(0, 1 - d / HOVER_RADIUS) * 0.5;
        }
        for (const ripple of ripples) {
          const age = t - ripple.t;
          const ring = age * 0.14;
          const d = Math.hypot(px - ripple.x, py - ripple.y);
          target +=
            Math.exp(-((d - ring) * (d - ring)) / 260) * Math.max(0, 1 - age / RIPPLE_LIFE) * 0.55;
        }
        cell.cur += (target - cell.cur) * (reduced ? 1 : 0.16);
        const shade = Math.min(SHADES - 1, Math.max(0, (cell.cur * SHADES) | 0));
        ctx!.fillStyle = INK[shade];
        if (round) {
          ctx!.beginPath();
          ctx!.roundRect(px - size / 2, py - size / 2, size, size, radius);
          ctx!.fill();
        } else {
          ctx!.fillRect(px - size / 2, py - size / 2, size, size);
        }
      }
    }

    let raf = 0;
    let onScreen = true;
    function frame(t: number) {
      draw(t);
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (!raf && !reduced && !document.hidden && onScreen) {
        raf = requestAnimationFrame(frame);
      }
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function local(e: PointerEvent) {
      const rect = stage!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMove(e: PointerEvent) {
      pointer = local(e);
      if (reduced) draw(performance.now());
    }
    function onLeave() {
      pointer = null;
      if (reduced) draw(performance.now());
    }
    function onDown(e: PointerEvent) {
      const { x, y } = local(e);
      ripples.push({ x, y, t: performance.now() });
      // ponte de choque: a placa de contribuições ondula da mesma tinta
      window.dispatchEvent(
        new CustomEvent("pe-ink", {
          detail: { x: e.clientX, y: e.clientY },
        }),
      );
      if (reduced) draw(performance.now());
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    function onMotionPref() {
      reduced = mq.matches;
      if (reduced) {
        stop();
        draw(performance.now()); // um quadro estático limpo, sem shimmer
      } else {
        start();
      }
    }

    const resize = new ResizeObserver(() => {
      fit();
      if (reduced || document.hidden) draw(performance.now());
    });
    resize.observe(stage);
    fit();

    // Fora de vista (display:none no mobile): nada para animar — o loop
    // para em vez de rodar em vazio.
    const visible = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    visible.observe(stage);

    let disposed = false;
    document.fonts.ready.then(() => {
      if (disposed) return;
      build();
      // O canvas nasce vazio e só ganha células depois de fonts.ready — o
      // fade mascara esse pop tardio (uma vez, só opacidade).
      cv!.style.transition = "opacity 200ms ease-out";
      cv!.style.opacity = "1";
      if (reduced) draw(performance.now());
      else start();
    });

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointerdown", onDown);
    document.addEventListener("visibilitychange", onVisibility);
    mq.addEventListener("change", onMotionPref);

    return () => {
      disposed = true;
      stop();
      resize.disconnect();
      visible.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", onMotionPref);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="relative -ml-1 hidden min-h-0 flex-1 select-none md:block"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-0" />
    </div>
  );
}
