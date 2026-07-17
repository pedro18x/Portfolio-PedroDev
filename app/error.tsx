"use client";

import { site } from "@/lib/content";

/**
 * Fronteira de erro do cliente: sem ela, qualquer exceção num efeito
 * derruba a árvore inteira para a tela genérica do Next. Mantém a página
 * na linguagem do site: quieta, monocromática, com uma saída real.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center bg-background">
      <div className="mx-auto w-full max-w-[26rem] px-6">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-faint">Error</p>
        <h1 className="mt-2 text-[1.25rem] font-semibold">Something went wrong.</h1>
        <p className="mt-2 text-[0.9375rem] text-muted-foreground">
          The page hit an unexpected error. You can try again, or just email me at{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <button
          type="button"
          onClick={reset}
          className="press mt-5 rounded-full bg-primary px-5 py-2 text-[0.875rem] font-semibold text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
