import { type HTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title: string
  children: ReactNode
}

/**
 * Um componente de seção reutilizável com um título e layout padronizados.
 *
 * @param {SectionProps} props As props do componente.
 * @param {string} props.title O título da seção.
 * @param {ReactNode} props.children O conteúdo da seção.
 * @param {string} [props.className] Classes CSS adicionais para o elemento section.
 * @returns {JSX.Element} O componente de seção renderizado.
 */
export function Section({ title, children, className, ...props }: SectionProps) {
  return (
    <section
      className={cn("w-full py-24", className)}
      {...props}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
        {children}
      </div>
    </section>
  )
} 