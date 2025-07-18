"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon, Home as HomeIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "next-themes"
import ThemeToggle from "../theme-toggle"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  onNavItemClick?: (id: string) => void
  activeSection?: string
}

/**
 * Componente de barra de navegação flutuante com um efeito "tubelight".
 * Fica fixo no topo da tela em todas as resoluções e atualiza automaticamente
 * o item ativo conforme o usuário rola pelas seções (scroll spy).
 *
 * @param {NavBarProps} props As propriedades do componente.
 * @param {NavItem[]} props.items A lista de itens de navegação.
 * @param {string} [props.className] Classes CSS adicionais para o contêiner.
 * @param {(id: string) => void} [props.onNavItemClick] Função de callback para rolagem suave em páginas de uma só tela.
 * @param {string} [props.activeSection] A seção atualmente ativa (para scroll spy).
 * @returns {JSX.Element | null} O componente de barra de navegação renderizado ou nulo se não estiver montado.
 */
export function NavBar({ items, className, onNavItemClick, activeSection }: NavBarProps) {
  const { language, toggleLanguage } = useLanguage()
  const { theme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none",
        className,
      )}
    >
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
        className="flex items-center gap-1 sm:gap-2 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg mt-4 sm:mt-6 pointer-events-auto"
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.url

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={(e) => {
                if (onNavItemClick) {
                  e.preventDefault()
                  onNavItemClick(item.url)
                }
              }}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-2 sm:px-4 py-2 rounded-full transition-colors",
                theme === "dark"
                  ? "text-foreground/80 hover:text-foreground"
                  : "text-neutral-700 hover:text-black",
                isActive && (theme === 'dark' ? "text-foreground" : "text-black"),
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className={cn(
                    "absolute inset-0 w-full rounded-full -z-10",
                    theme === "dark" ? "bg-white/10" : "bg-black/10",
                  )}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div
                    className={cn(
                      "absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full",
                      theme === "dark" ? "bg-white" : "bg-black",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute w-12 h-6 rounded-full blur-md -top-2 -left-2",
                        theme === "dark" ? "bg-white/20" : "bg-black/20",
                      )}
                    />
                    <div
                      className={cn(
                        "absolute w-8 h-6 rounded-full blur-md -top-1",
                        theme === "dark" ? "bg-white/20" : "bg-black/20",
                      )}
                    />
                    <div
                      className={cn(
                        "absolute w-4 h-4 rounded-full blur-sm top-0 left-2",
                        theme === "dark" ? "bg-white/20" : "bg-black/20",
                      )}
                    />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <div className={cn("h-6 w-px", theme === 'dark' ? "bg-border/50" : "bg-black")} />

          <div
            onClick={toggleLanguage}
            className="relative cursor-pointer text-sm font-semibold transition-colors text-foreground/80 flex items-center justify-center px-1 sm:px-2"
            aria-label="Change language"
          >
            <div className="relative p-1 sm:p-1.5">
              <span className={cn("transition-colors text-xs sm:text-sm", language === 'pt' ? 'text-foreground' : 'text-foreground/50 hover:text-foreground')}>PT</span>
              {language === 'pt' && <motion.div className={cn("absolute bottom-0.5 sm:bottom-1 left-1 sm:left-1.5 right-1 sm:right-1.5 h-[1px]", theme === "dark" ? "bg-white shadow-[0_0_4px_#fff]" : "bg-black shadow-[0_0_4px_#000]")} layoutId="language-underline" />}
            </div>
            <div className={cn("h-4 w-px", theme === 'dark' ? "bg-border/50" : "bg-black")} />
            <div className="relative p-1 sm:p-1.5">
              <span className={cn("transition-colors text-xs sm:text-sm", language === 'en' ? 'text-foreground' : 'text-foreground/50 hover:text-foreground')}>EN</span>
              {language === 'en' && <motion.div className={cn("absolute bottom-0.5 sm:bottom-1 left-1 sm:left-1.5 right-1 sm:right-1.5 h-[1px]", theme === "dark" ? "bg-white shadow-[0_0_4px_#fff]" : "bg-black shadow-[0_0_4px_#000]")} layoutId="language-underline" />}
            </div>
          </div>
          <ThemeToggle />
        </div>
      </motion.div>
    </div>
  )
} 