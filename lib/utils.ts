import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina nomes de classe de forma inteligente, resolvendo conflitos do Tailwind CSS.
 * @param {...ClassValue} inputs - Uma lista de nomes de classe a serem combinados.
 * @returns {string} Uma string com os nomes de classe mesclados.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
} 