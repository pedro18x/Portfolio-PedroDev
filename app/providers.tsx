"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Componente que centraliza todos os provedores de contexto da aplicação.
 * Envolve os componentes filhos com os contextos necessários, como o tema (ThemeProvider)
 * e o idioma (LanguageProvider).
 *
 * @param {ProvidersProps} props - As propriedades do componente.
 * @param {ReactNode} props.children - Os componentes filhos que receberão os contextos.
 * @returns {JSX.Element} O componente com os provedores configurados.
 */
export function Providers({ children }: ProvidersProps): JSX.Element {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
} 