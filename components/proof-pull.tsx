"use client";

import { useEffect, useRef } from "react";

/**
 * Proof Pull: a orelha de página no canto inferior direito. Arrastar
 * descola a folha inteira do site como papel saindo de uma prensa e
 * revela, por baixo, um campo vivo de glifos monoespaçados que escorre
 * como líquido e reage ao ponteiro (esteira que brilha, clique respinga).
 *
 * Mecânica biestável: soltar cedo devolve a folha com a mola; puxar além
 * de ~40% da diagonal e soltar arranca a folha e deixa o campo jogável.
 * O canto (agora dobrado ao contrário) ou Escape recoloca a página.
 *
 * Zero dependências: dobra 2D (bissetriz perpendicular) com clip-path na
 * própria página, canvas 2D só para a aba enrolada e para o campo. rAF
 * apenas durante arrasto/mola/campo visível; nada roda em repouso.
 * Movimento reduzido: sem enrolar — o botão alterna para um quadro
 * estático do campo onde o ponteiro ainda acende glifos localmente.
 */

const CONFIG = {
  DPR_MAX: 2,
  ROLL_DIV: 6,
  ROLL_MIN: 24,
  ROLL_MAX: 140, // raio do rolo r = clamp(d/ROLL_DIV, MIN, MAX)
  BAND_START: 0.45,
  BAND_FACTOR: 0.25, // elástico além de 45% da diagonal
  COMMIT_AT: 0.4, // soltar além disto: a folha abre
  BOW: 0.7, // bojo do vinco = BOW * r, para o lado da chapa
  CREST_AT: 0.5, // crista de luz a CREST_AT * r do vinco
  SHADOW_ALPHA: 0.3, // sombra projetada na chapa (comprimento segue r)
  LIFT_BLUR: 22,
  LIFT_ALPHA: 0.28, // sombra de elevação da aba sobre a página branca
  VALLEY: "#cfcfcf",
  CREST: "#ffffff",
  BACK_MID: "#fbfbfb",
  BACK_FAR: "#f2f2f2",
  CREASE_ALPHA: 0.22,
  SPRING_K: 170,
  SPRING_C: 20, // mola de retorno subamortecida (um leve overshoot)
  OPEN_V0: 1600,
  OPEN_A: 3200, // chicote de abertura após o commit
  OPEN_V_MAX: 3200, // teto do chicote quando o peteleco é forte
  MIN_D: 26, // abaixo disto no soltar, assenta direto na orelha
  // Dispensa por momento (barra Emil, gestos): a linha de distância não é
  // a única porta — velocidade radial no soltar também decide.
  FLICK_OPEN: 0.7, // px/ms para fora: peteleco abre mesmo aquém da linha
  FLICK_VETO: -0.5, // px/ms para dentro: puxão forte veta a abertura
  MIN_FLICK_D: 90, // peteleco só conta com a folha já levantada
  RETURN_V_MAX: 2200, // teto (px/s) do momento herdado pela mola
  V_STALE_MS: 120, // parado além disto, a velocidade lida vira zero
};

const FIELD = {
  RAMP: " .·:-=pe8@", // rampa de densidade; "pe" mora no meio dela
  SHADES: ["#3a3a3a", "#565656", "#7f7f7f", "#b5b5b5", "#f0f0f0"],
  CW: 12,
  CH: 20,
  // Mesmo token --font-mono do tema (canvas não resolve var())
  FONT: '15px "SF Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  SPEED: 0.6, // fluxo ambiente
  DECAY: 0.86,
  DIFFUSE: 0.03, // DECAY + 4*DIFFUSE < 1, senão a energia diverge
  EMAX: 1.2, // teto de energia por célula
  CURVE: 1.7, // curva de densidade; maior = mais ar escuro
  SPLAT: 0.9,
  BURST: 4, // mexer (movimento) e respingar (clique)
};

interface Pt {
  x: number;
  y: number;
  onFold?: boolean;
}

/**
 * Sutherland–Hodgman contra o semiplano dot(p−M, n) ≥ 0 (ou ≤ 0).
 * `markFold` marca vértices novos como pertencentes ao vinco: só o recorte
 * da DOBRA marca; os recortes da caixa local não (o vinco desenhado com
 * bojo é a aresta entre dois vértices marcados consecutivos).
 */
function clipHalfplane(poly: Pt[], M: Pt, n: Pt, keepPositive: boolean, markFold = false): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const da = (a.x - M.x) * n.x + (a.y - M.y) * n.y;
    const db = (b.x - M.x) * n.x + (b.y - M.y) * n.y;
    const ain = keepPositive ? da >= 0 : da <= 0;
    const bin = keepPositive ? db >= 0 : db <= 0;
    if (ain) out.push(a);
    if (ain !== bin) {
      const t = da / (da - db);
      out.push({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        onFold: markFold,
      });
    }
  }
  return out;
}

function reflect(p: Pt, M: Pt, n: Pt): Pt {
  const d = (p.x - M.x) * n.x + (p.y - M.y) * n.y;
  return { x: p.x - 2 * d * n.x, y: p.y - 2 * d * n.y, onFold: p.onFold };
}

export function ProofPull() {
  const plateRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const flapRef = useRef<HTMLCanvasElement>(null);
  const dogRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const plate = plateRef.current;
    const fieldCanvas = fieldRef.current;
    const flap = flapRef.current;
    const dogear = dogRef.current;
    const sheet = document.getElementById("top");
    if (!plate || !fieldCanvas || !flap || !dogear || !sheet) return;

    const fctx = flap.getContext("2d");
    const gctx = fieldCanvas.getContext("2d");
    if (!fctx || !gctx) return;

    plate.setAttribute("inert", "");
    sheet.classList.add("proof-sheet");

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isRM = () => mq.matches;

    /* ------------------------------ aba ------------------------------ */
    let fw = 0;
    let fh = 0;
    const sizeFlap = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.DPR_MAX);
      fw = window.innerWidth;
      fh = window.innerHeight;
      flap.width = Math.round(fw * dpr);
      flap.height = Math.round(fh * dpr);
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFlap = (lifted: Pt[], flapPoly: Pt[], M: Pt, n: Pt, r: number) => {
      fctx.clearRect(0, 0, fw, fh);
      if (lifted.length < 3 || flapPoly.length < 3) return;

      // vinco = a aresta entre os dois vértices consecutivos sobre a dobra
      let ci = -1;
      for (let i = 0; i < flapPoly.length; i++) {
        if (flapPoly[i].onFold && flapPoly[(i + 1) % flapPoly.length].onFold) {
          ci = i;
          break;
        }
      }

      // 1. sombra projetada na chapa, recortada à região levantada
      fctx.save();
      fctx.beginPath();
      lifted.forEach((p, i) => (i ? fctx.lineTo(p.x, p.y) : fctx.moveTo(p.x, p.y)));
      fctx.closePath();
      fctx.clip();
      const shadowLen = 40 + r;
      const sg = fctx.createLinearGradient(M.x, M.y, M.x + n.x * shadowLen, M.y + n.y * shadowLen);
      sg.addColorStop(0, `rgba(0,0,0,${CONFIG.SHADOW_ALPHA})`);
      sg.addColorStop(1, "rgba(0,0,0,0)");
      fctx.fillStyle = sg;
      fctx.fillRect(0, 0, fw, fh);
      fctx.restore();

      // 2. a aba: verso de papel com sombreado cilíndrico; o vinco boja
      const bow = CONFIG.BOW * r;
      const tracePath = () => {
        fctx.beginPath();
        if (ci >= 0) {
          const A = flapPoly[ci];
          const B = flapPoly[(ci + 1) % flapPoly.length];
          const mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
          // a quadrática alcança metade do offset do controle
          const ctrl = { x: mid.x + n.x * bow * 2, y: mid.y + n.y * bow * 2 };
          fctx.moveTo(A.x, A.y);
          fctx.quadraticCurveTo(ctrl.x, ctrl.y, B.x, B.y);
          for (let k = 2; k <= flapPoly.length; k++) {
            const p = flapPoly[(ci + k) % flapPoly.length];
            fctx.lineTo(p.x, p.y);
          }
        } else {
          flapPoly.forEach((p, i) => (i ? fctx.lineTo(p.x, p.y) : fctx.moveTo(p.x, p.y)));
        }
        fctx.closePath();
      };

      // 2a. sombra de elevação: separa a aba da página branca por baixo
      fctx.save();
      tracePath();
      fctx.shadowColor = `rgba(0,0,0,${CONFIG.LIFT_ALPHA})`;
      fctx.shadowBlur = CONFIG.LIFT_BLUR;
      fctx.shadowOffsetX = n.x * 8;
      fctx.shadowOffsetY = n.y * 8;
      fctx.fillStyle = "#ffffff";
      fctx.fill();
      fctx.restore();

      // 2b. sombreado cilíndrico por cima da silhueta
      tracePath();
      let ext = 1;
      for (const p of flapPoly) {
        ext = Math.max(ext, -((p.x - M.x) * n.x + (p.y - M.y) * n.y));
      }
      const fg = fctx.createLinearGradient(M.x, M.y, M.x - n.x * ext, M.y - n.y * ext);
      const crest = Math.min(0.85, (CONFIG.CREST_AT * r) / ext);
      fg.addColorStop(0, CONFIG.VALLEY);
      fg.addColorStop(crest, CONFIG.CREST);
      fg.addColorStop(Math.min(1, crest + 0.3), CONFIG.BACK_MID);
      fg.addColorStop(1, CONFIG.BACK_FAR);
      fctx.fillStyle = fg;
      fctx.fill();

      // 3. linha do vinco por cima da emenda com o clip-path
      if (ci >= 0) {
        const A = flapPoly[ci];
        const B = flapPoly[(ci + 1) % flapPoly.length];
        const mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
        const ctrl = { x: mid.x + n.x * bow * 2, y: mid.y + n.y * bow * 2 };
        fctx.beginPath();
        fctx.moveTo(A.x, A.y);
        fctx.quadraticCurveTo(ctrl.x, ctrl.y, B.x, B.y);
        fctx.strokeStyle = `rgba(0,0,0,${CONFIG.CREASE_ALPHA})`;
        fctx.lineWidth = 1;
        fctx.stroke();
      }
    };

    /* --------------------------- campo vivo --------------------------- */
    let atlas: HTMLCanvasElement | null = null;
    let atlasDpr = 1;
    let gw = 0;
    let gh = 0;
    let energy: Float32Array | null = null;
    let energyNext: Float32Array | null = null;
    let ft = 0;
    let fRaf = 0;
    let fLast = 0;
    let fieldActive = false;

    const buildAtlas = (dpr: number) => {
      atlasDpr = dpr;
      atlas = document.createElement("canvas");
      const n = FIELD.RAMP.length;
      const s = FIELD.SHADES.length;
      atlas.width = Math.round(FIELD.CW * n * dpr);
      atlas.height = Math.round(FIELD.CH * s * dpr);
      const a = atlas.getContext("2d");
      if (!a) return;
      a.setTransform(dpr, 0, 0, dpr, 0, 0);
      a.font = FIELD.FONT;
      a.textBaseline = "middle";
      a.textAlign = "center";
      for (let si = 0; si < s; si++) {
        a.fillStyle = FIELD.SHADES[si];
        for (let gi = 0; gi < n; gi++) {
          a.fillText(FIELD.RAMP[gi], gi * FIELD.CW + FIELD.CW / 2, si * FIELD.CH + FIELD.CH / 2);
        }
      }
    };

    const sizeField = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.DPR_MAX);
      fieldCanvas.width = Math.round(window.innerWidth * dpr);
      fieldCanvas.height = Math.round(window.innerHeight * dpr);
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gw = Math.ceil(window.innerWidth / FIELD.CW);
      gh = Math.ceil(window.innerHeight / FIELD.CH);
      energy = new Float32Array(gw * gh);
      energyNext = new Float32Array(gw * gh);
      buildAtlas(dpr);
    };

    const splat = (cx: number, cy: number, amt: number, rad = 3) => {
      if (!energy) return;
      const gx = Math.floor(cx / FIELD.CW);
      const gy = Math.floor(cy / FIELD.CH);
      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad; dx <= rad; dx++) {
          const x = gx + dx;
          const y = gy + dy;
          if (x < 0 || y < 0 || x >= gw || y >= gh) continue;
          energy[y * gw + x] += amt * Math.exp(-(dx * dx + dy * dy) / (rad * 1.4));
        }
      }
    };

    const drawField = (dt: number) => {
      if (!energy || !energyNext || !atlas) return;
      ft += dt * FIELD.SPEED;
      // esteira: decaimento + difusão (o ripple que segue o ponteiro)
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          const i = y * gw + x;
          const l = x > 0 ? energy[i - 1] : 0;
          const r2 = x < gw - 1 ? energy[i + 1] : 0;
          const u = y > 0 ? energy[i - gw] : 0;
          const dn = y < gh - 1 ? energy[i + gw] : 0;
          const en = energy[i] * FIELD.DECAY + (l + r2 + u + dn) * FIELD.DIFFUSE;
          energyNext[i] = en > FIELD.EMAX ? FIELD.EMAX : en;
        }
      }
      const tmp = energy;
      energy = energyNext;
      energyNext = tmp;

      gctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const n = FIELD.RAMP.length;
      const s = FIELD.SHADES.length;
      const cw = FIELD.CW;
      const ch = FIELD.CH;
      const ad = atlasDpr;
      const cx0 = gw / 2 + Math.sin(ft * 0.13) * gw * 0.25;
      const cy0 = gh / 2 + Math.cos(ft * 0.1) * gh * 0.25;
      for (let y = 0; y < gh; y++) {
        const sy = Math.sin(y * 0.27 - ft * 0.66);
        for (let x = 0; x < gw; x++) {
          const a = Math.sin(x * 0.55 + ft * 0.9);
          const c = Math.sin(x * 0.21 + y * 0.34 + ft * 0.44);
          const dd = Math.sin(Math.hypot(x - cx0, y - cy0) * 0.31 - ft);
          let v = ((a + sy + c + dd) / 4) * 0.5 + 0.5;
          // empurra o campo base para o escuro: a esteira é o que brilha
          v = Math.pow(v, FIELD.CURVE);
          v += energy[y * gw + x];
          v = v < 0 ? 0 : v > 1 ? 1 : v;
          const gi = Math.min(n - 1, (v * n) | 0);
          if (gi === 0) continue;
          const si = Math.min(s - 1, (v * s) | 0);
          gctx.drawImage(
            atlas,
            gi * cw * ad,
            si * ch * ad,
            cw * ad,
            ch * ad,
            x * cw,
            y * ch,
            cw,
            ch,
          );
        }
      }
    };

    const fieldLoop = (t: number) => {
      if (!fieldActive) return;
      const dt = Math.min((t - fLast) / 1000, 0.05);
      fLast = t;
      drawField(dt);
      if (isRM()) return; // modo estático: um quadro, redesenhado sob demanda
      fRaf = requestAnimationFrame(fieldLoop);
    };
    const startField = () => {
      if (fieldActive) return;
      fieldActive = true;
      sizeField();
      fLast = performance.now();
      fRaf = requestAnimationFrame(fieldLoop);
    };
    const stopField = () => {
      fieldActive = false;
      cancelAnimationFrame(fRaf);
    };

    /* --------------------------- controlador --------------------------- */
    type Mode = "rest" | "drag" | "spring" | "opening" | "plateview";
    let mode: Mode = "rest";
    let pid: number | null = null;
    let C: Pt = { x: 0, y: 0 };
    let dir: Pt = { x: -0.7071, y: -0.7071 };
    let d = 0;
    let vel = 0;
    let lastRaw = 0;
    let grab0 = 0; // folga da pegada: pressionar pinça o canto, não dobra
    let vRad = 0; // velocidade radial suavizada (px/ms; + = para fora)
    let lastMoveT = 0;
    let sy0 = 0;
    let docH = 0;
    let diag = 0;
    let rafId = 0;
    let lastT = 0;

    // Travar o scroll remove a barra clássica e reflui a página; compensar
    // com padding mantém a geometria idêntica (overlay scrollbar: sw = 0).
    let sbComp = 0;
    const lockScroll = () => {
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      if (sw > 0) {
        sbComp = sw;
        document.body.style.paddingRight = `${sw}px`;
        // chapa/aba/orelha encolhem junto (ver var(--proof-sbc) no CSS):
        // sem isso uma tira de chapa escura vazaria pela borda direita
        document.documentElement.style.setProperty("--proof-sbc", `${sw}px`);
      }
    };
    const unlockScroll = () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      if (sbComp > 0) {
        document.body.style.paddingRight = "";
        document.documentElement.style.removeProperty("--proof-sbc");
        sbComp = 0;
      }
    };

    // clip-path: path(evenodd) permite recortar "retângulo menos mordida",
    // essencial para a dobra LOCAL; sem suporte, cai na dobra de plano
    // inteiro (funcional, só menos bonita em d pequeno)
    const PATH_CLIP =
      typeof CSS !== "undefined" && CSS.supports("clip-path", 'path("M 0 0 H 1 V 1 Z")');

    const render = (): number => {
      if (d < 2) {
        sheet.style.clipPath = "none";
        fctx.clearRect(0, 0, fw, fh);
        return 4;
      }
      const P = { x: C.x + dir.x * d, y: C.y + dir.y * d };
      const M = { x: (C.x + P.x) / 2, y: (C.y + P.y) / 2 };
      const n = { x: -dir.x, y: -dir.y }; // aponta para o lado levantado
      const docPoly: Pt[] = [
        { x: 0, y: -sy0 },
        { x: C.x, y: -sy0 },
        { x: C.x, y: docH - sy0 },
        { x: 0, y: docH - sy0 },
      ];
      const keep = clipHalfplane(docPoly, M, n, false); // sinal de término
      let lifted = clipHalfplane(docPoly, M, n, true, true);

      if (PATH_CLIP) {
        // Dobra LOCAL: só um retalho de canto levanta, como papel de
        // verdade. Sem esta caixa, a linha de dobra estendida pelo
        // documento inteiro faz um arrasto de 80px cobrir metade da
        // viewport com verso de papel. A caixa cresce com d: em pulls
        // fundos vira a dobra de folha inteira do espetáculo.
        const L = 4 * d + 80;
        lifted = clipHalfplane(lifted, { x: C.x - L, y: 0 }, { x: 1, y: 0 }, true);
        lifted = clipHalfplane(lifted, { x: 0, y: C.y - L }, { x: 0, y: 1 }, true);
        if (keep.length < 3) {
          sheet.style.clipPath = "polygon(0px 0px, 0px 0px, 0px 0px)";
        } else if (lifted.length >= 3) {
          const bite =
            lifted
              .map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(2)} ${(p.y + sy0).toFixed(2)}`)
              .join(" ") + " Z";
          sheet.style.clipPath = `path(evenodd, "M 0 0 H ${C.x.toFixed(2)} V ${docH.toFixed(2)} H 0 Z ${bite}")`;
        } else {
          sheet.style.clipPath = "none";
        }
      } else {
        sheet.style.clipPath =
          keep.length >= 3
            ? `polygon(${keep
                .map((p) => `${p.x.toFixed(2)}px ${(p.y + sy0).toFixed(2)}px`)
                .join(", ")})`
            : "polygon(0px 0px, 0px 0px, 0px 0px)";
      }

      const flapPoly = lifted.map((p) => reflect(p, M, n));
      const r = Math.min(Math.max(d / CONFIG.ROLL_DIV, CONFIG.ROLL_MIN), CONFIG.ROLL_MAX);
      drawFlap(lifted, flapPoly, M, n, r);
      return keep.length;
    };

    const moveDrag = (e: PointerEvent) => {
      const px = Math.min(e.clientX, C.x - 2);
      const py = Math.min(e.clientY, C.y - 2);
      const vx = px - C.x;
      const vy = py - C.y;
      // A dobra nasce só depois que a mão anda: sem a folga, segurar parado
      // já dobrava ~30px (offset da pegada na área de 44px) e a linha de
      // dobra, estendida pelo documento inteiro, cobria a base da viewport
      // com uma tira de "verso de papel" — lia-se como layout quebrado.
      const rawAbs = Math.hypot(vx, vy);
      const raw = Math.max(0, rawAbs - grab0);
      const now = performance.now();
      if (lastMoveT > 0) {
        const inst = (raw - lastRaw) / Math.max(now - lastMoveT, 1);
        vRad = vRad * 0.8 + inst * 0.2;
      }
      lastMoveT = now;
      lastRaw = raw;
      // dir SEMPRE normalizado pela magnitude REAL do vetor: dividir pela
      // efetiva (com a folga descontada) gerava |dir| >> 1 no início do
      // arrasto e explodia toda a geometria da dobra (reflect() assume n
      // unitário) — com movimentos reais de 1-2px isso era o arrasto inteiro
      if (rawAbs > 4) dir = { x: vx / rawAbs, y: vy / rawAbs };
      const D = CONFIG.BAND_START * diag;
      d = raw > D ? D + (raw - D) * CONFIG.BAND_FACTOR : raw;
      // a orelha só some quando a dobra existe de fato
      if (d > 8) dogear.dataset.peeling = "true";
      splat(px, py, FIELD.SPLAT * 0.6); // o campo se agita sob a folha
      render();
    };

    const beginDrag = (e: PointerEvent) => {
      mode = "drag";
      pid = e.pointerId;
      try {
        dogear.setPointerCapture(pid);
      } catch {
        /* captura é conveniência, não dependência */
      }
      sy0 = window.scrollY;
      lockScroll(); // antes da geometria: com barra clássica a folha encolhe sbComp px
      C = { x: window.innerWidth - sbComp, y: window.innerHeight };
      docH = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      diag = Math.hypot(C.x, C.y);
      d = 0;
      vel = 0;
      lastRaw = 0;
      vRad = 0;
      lastMoveT = 0;
      grab0 = Math.hypot(Math.min(e.clientX, C.x - 2) - C.x, Math.min(e.clientY, C.y - 2) - C.y);
      sizeFlap();
      startField();
      plate.dataset.on = "true";
      flap.dataset.on = "true";
      sheet.classList.add("is-peeling");
      moveDrag(e);
    };

    const settlePop = () => {
      if (isRM()) return;
      dogear.classList.add("proof-settle");
      setTimeout(() => dogear.classList.remove("proof-settle"), 300);
    };

    const endDragVisuals = (withSettle: boolean) => {
      sheet.style.clipPath = "none";
      sheet.classList.remove("is-peeling");
      fctx.clearRect(0, 0, fw, fh);
      delete flap.dataset.on;
      delete plate.dataset.on;
      stopField();
      delete dogear.dataset.peeling;
      unlockScroll();
      mode = "rest";
      if (withSettle) settlePop();
    };

    const springHome = () => {
      mode = "spring";
      // a orelha reaparece já no voo de volta: re-agarrá-la interrompe a
      // mola e retoma o arrasto (mesma regra do monograma em coast)
      delete dogear.dataset.peeling;
      lastT = performance.now();
      cancelAnimationFrame(rafId);
      const step = (t: number) => {
        const dt = Math.min((t - lastT) / 1000, 0.032);
        lastT = t;
        const a = -CONFIG.SPRING_K * d - CONFIG.SPRING_C * vel;
        vel += a * dt;
        d += vel * dt;
        if (d <= CONFIG.MIN_D && vel < 0) {
          endDragVisuals(true);
          return;
        }
        render();
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    };

    const finishOpen = () => {
      cancelAnimationFrame(rafId);
      // a folha já está toda recortada; a opacidade assume dali
      document.body.classList.add("plate-view");
      sheet.classList.add("is-hidden");
      // opacidade 0 não tira a folha nem do Tab nem da árvore de
      // acessibilidade: inert + aria-hidden fazem o esconder de verdade
      sheet.setAttribute("inert", "");
      sheet.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        sheet.style.clipPath = "none";
      }, 150);
      sheet.classList.remove("is-peeling");
      delete flap.dataset.on;
      flap.style.opacity = "";
      fctx.clearRect(0, 0, fw, fh);
      delete dogear.dataset.peeling;
      dogear.dataset.open = "true";
      dogear.setAttribute("aria-pressed", "true");
      dogear.setAttribute("aria-label", "Put the page back");
      mode = "plateview";
    };

    // puxou além da linha de commit: a folha chicoteia para fora
    const openFromPeel = () => {
      mode = "opening";
      lastT = performance.now();
      cancelAnimationFrame(rafId);
      flap.style.opacity = "0";
      // um peteleco forte chicoteia mais rápido (momento preservado)
      let v = Math.min(Math.max(CONFIG.OPEN_V0, vRad * 1000), CONFIG.OPEN_V_MAX);
      const step = (t: number) => {
        const dt = Math.min((t - lastT) / 1000, 0.032);
        lastT = t;
        v += CONFIG.OPEN_A * dt;
        d += v * dt;
        const kept = render();
        if (d > diag * 1.3 || kept < 3) {
          finishOpen();
          return;
        }
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    };

    const enterPlateView = () => {
      startField();
      lockScroll();
      plate.dataset.on = "true";
      document.body.classList.add("plate-view");
      sheet.classList.add("is-hidden");
      sheet.setAttribute("inert", "");
      sheet.setAttribute("aria-hidden", "true");
      dogear.dataset.open = "true";
      dogear.setAttribute("aria-pressed", "true");
      dogear.setAttribute("aria-label", "Put the page back");
      mode = "plateview";
    };

    const exitPlateView = () => {
      document.body.classList.remove("plate-view");
      sheet.classList.remove("is-hidden");
      sheet.removeAttribute("inert");
      sheet.removeAttribute("aria-hidden");
      delete dogear.dataset.open;
      dogear.setAttribute("aria-pressed", "false");
      dogear.setAttribute("aria-label", "Pull a proof: see what lives behind this page");
      setTimeout(() => {
        if (mode === "rest") {
          delete plate.dataset.on;
          stopField();
        }
      }, 140);
      unlockScroll();
      mode = "rest";
      settlePop();
    };

    /* ---------------------------- eventos ---------------------------- */
    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      if (mode === "plateview" || mode === "opening") return; // click resolve
      if (mode === "spring") {
        // re-agarrou no meio da mola: sem teardown — o arrasto retoma e a
        // dobra retarget-a para o ponteiro no mesmo quadro
        cancelAnimationFrame(rafId);
        mode = "rest";
      }
      if (mode !== "rest") return;
      if (isRM()) return; // RM: clique/Enter alternam a vista estática
      beginDrag(e);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (mode !== "drag" || e.pointerId !== pid) return;
      moveDrag(e);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (mode !== "drag" || e.pointerId !== pid) return;
      // velocidade velha não conta: parado > V_STALE_MS = soltar em repouso
      if (performance.now() - lastMoveT > CONFIG.V_STALE_MS) vRad = 0;
      const past = lastRaw >= CONFIG.COMMIT_AT * diag;
      const flick = vRad > CONFIG.FLICK_OPEN && lastRaw > CONFIG.MIN_FLICK_D;
      // abre por distância (salvo puxão forte de volta) ou por peteleco
      if ((past && vRad > CONFIG.FLICK_VETO) || flick) {
        openFromPeel();
        return;
      }
      if (d < CONFIG.MIN_D) {
        endDragVisuals(true);
        return;
      }
      // a mola herda o momento da mão (só o componente para dentro)
      vel = Math.max(Math.min(0, vRad * 1000), -CONFIG.RETURN_V_MAX);
      springHome();
    };
    const onContext = (e: Event) => e.preventDefault();

    // teclado (click com detail 0) e ativação por ponteiro sob RM
    const onClick = (e: MouseEvent) => {
      const keyboard = e.detail === 0;
      if (mode === "plateview") {
        exitPlateView();
        return;
      }
      if (mode !== "rest") return;
      if (keyboard || isRM()) enterPlateView();
    };

    // com o campo visível, o ponteiro mexe nele; pressionar respinga
    let lastFP: Pt | null = null;
    const onWindowMove = (e: PointerEvent) => {
      if (!fieldActive || mode === "drag") return;
      const sp = lastFP ? Math.hypot(e.clientX - lastFP.x, e.clientY - lastFP.y) : 6;
      lastFP = { x: e.clientX, y: e.clientY };
      splat(e.clientX, e.clientY, Math.min(sp * 0.05, 1) * FIELD.SPLAT);
      if (isRM() && mode === "plateview") drawField(0);
    };
    const onWindowDown = (e: PointerEvent) => {
      if (mode !== "plateview") return;
      if (e.target === dogear || dogear.contains(e.target as Node)) return;
      splat(e.clientX, e.clientY, FIELD.BURST, 7);
      if (isRM()) drawField(0);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mode === "plateview") exitPlateView();
      else if (mode === "drag") {
        vel = 0;
        springHome();
      }
    };

    const onResize = () => {
      if (mode === "drag" || mode === "spring" || mode === "opening") {
        cancelAnimationFrame(rafId);
        flap.style.opacity = "";
        document.body.classList.remove("plate-view");
        sheet.classList.remove("is-hidden");
        sheet.removeAttribute("inert");
        sheet.removeAttribute("aria-hidden");
        endDragVisuals(false);
      } else if (mode === "plateview") {
        sizeField();
        drawField(0);
      }
    };

    // Arrasto órfão: se a janela perde o foco no meio (Cmd-Tab, diálogo),
    // o pointerup pode nunca chegar — devolve a folha em vez de deixá-la
    // presa dobrada com o scroll travado.
    const onWindowBlur = () => {
      if (mode !== "drag") return;
      vel = 0;
      springHome();
    };

    // A preferência de movimento pode mudar NO MEIO da sessão: se sair de
    // reduzido com o campo aberto, religa o loop (parado, o campo estático
    // engoliria os splats do ponteiro para sempre).
    const onMotionPref = () => {
      if (!mq.matches && fieldActive && mode === "plateview") {
        cancelAnimationFrame(fRaf);
        fLast = performance.now();
        fRaf = requestAnimationFrame(fieldLoop);
      }
    };

    // aba oculta: pausa o rAF do campo; volta quando a aba volta
    const onVisibility = () => {
      if (!fieldActive) return;
      cancelAnimationFrame(fRaf);
      if (!document.hidden && !isRM()) {
        fLast = performance.now();
        fRaf = requestAnimationFrame(fieldLoop);
      }
    };

    dogear.addEventListener("pointerdown", onPointerDown);
    dogear.addEventListener("pointermove", onPointerMove);
    dogear.addEventListener("pointerup", onPointerUp);
    dogear.addEventListener("pointercancel", onPointerUp);
    dogear.addEventListener("contextmenu", onContext);
    dogear.addEventListener("click", onClick);
    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("pointerdown", onWindowDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("visibilitychange", onVisibility);
    mq.addEventListener("change", onMotionPref);

    return () => {
      dogear.removeEventListener("pointerdown", onPointerDown);
      dogear.removeEventListener("pointermove", onPointerMove);
      dogear.removeEventListener("pointerup", onPointerUp);
      dogear.removeEventListener("pointercancel", onPointerUp);
      dogear.removeEventListener("contextmenu", onContext);
      dogear.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("pointerdown", onWindowDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", onMotionPref);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(fRaf);
      document.body.classList.remove("plate-view");
      sheet.classList.remove("proof-sheet", "is-peeling", "is-hidden");
      sheet.removeAttribute("inert");
      sheet.removeAttribute("aria-hidden");
      sheet.style.clipPath = "";
      unlockScroll();
    };
  }, []);

  return (
    <>
      <div ref={plateRef} className="proof-plate" aria-hidden="true">
        <canvas ref={fieldRef} className="absolute inset-0" />
        <div className="proof-sheen" />
      </div>
      <canvas ref={flapRef} className="proof-flap" aria-hidden="true" />
      <button
        ref={dogRef}
        type="button"
        className="proof-dogear"
        aria-label="Pull a proof: see what lives behind this page"
        aria-pressed="false"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path className="proof-tri-plate" d="M24 24 L0 24 L24 0 Z" />
          <path className="proof-tri-flap" d="M0 24 L24 0 L0 0 Z" />
        </svg>
      </button>
    </>
  );
}
