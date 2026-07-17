"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface RollingDigitsProps {
  value: string;
  className?: string;
  /** duração do rolo por atualização; 0 = salto sem transição */
  durationMs?: number;
}

/*
 * Odômetro tipográfico: cada dígito é uma coluna 0-9 que desliza por
 * translateY na mola do site (padrão do @react-bits/Counter, reimplementado
 * nos tokens do site, sem dependências novas). Caracteres não numéricos
 * (":" do relógio, "," de milhar) ficam estáticos. Movimento reduzido:
 * texto plano trocado no lugar.
 */
export function RollingDigits({ value, className, durationMs = 300 }: RollingDigitsProps) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    // a preferência pode mudar no meio da sessão: assinar, não amostrar
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reduced) return <span className={className}>{value}</span>;

  return (
    <span className={cn("odo", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="odo-track">
        {value.split("").map((ch, i) =>
          ch >= "0" && ch <= "9" ? (
            <span
              key={i}
              className="odo-col"
              style={{
                transform: `translateY(-${Number(ch)}em)`,
                transitionDuration: `${durationMs}ms`,
              }}
            >
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          ) : (
            <span key={`c-${i}`}>{ch}</span>
          ),
        )}
      </span>
    </span>
  );
}
