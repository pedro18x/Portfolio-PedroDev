"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useMorphingText } from "./use-morphing-text";

/**
 * Controle "copy" ao lado do email no rodapé: copia o endereço e faz
 * morph para "copied", revertendo após 2s.
 */
export function CopyEmail({ email }: { email: string }) {
  const { text, morphing, morph } = useMorphingText("copy");
  const revertTimer = useRef<ReturnType<typeof setTimeout>>();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    morph("copied");
    clearTimeout(revertTimer.current);
    revertTimer.current = setTimeout(() => morph("copy"), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy email address"
      className="press font-mono text-faint underline decoration-softline underline-offset-[3px] transition-colors duration-150 hover:text-foreground hover:decoration-current"
    >
      <span className={cn("morphable", morphing && "morphing")}>{text}</span>
      {/* o morph visual é mudo para leitores (aria-label fixa o nome);
          a confirmação de cópia sai por esta região viva */}
      <span aria-live="polite" className="sr-only">
        {text === "copied" ? "Email address copied" : ""}
      </span>
    </button>
  );
}
