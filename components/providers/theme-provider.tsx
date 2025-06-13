"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * Um wrapper para o `next-themes` que fornece o contexto do tema para a aplicação.
 * Permite alternar entre temas claro, escuro e do sistema.
 *
 * @param {ThemeProviderProps} props - As propriedades do provider, repassadas para `next-themes`.
 * @returns {JSX.Element} O provider de tema envolvendo os componentes filhos.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
} 