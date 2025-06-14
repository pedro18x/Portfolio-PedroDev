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
}

export function NavBar({ items, className, onNavItemClick }: NavBarProps) {
  const { language, toggleLanguage } = useLanguage()
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none",
        className,
      )}
    >
      <motion.div
        initial={{ y: isMobile ? 100 : -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
        className="flex items-center gap-2 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg mb-6 sm:mb-0 sm:mt-6 pointer-events-auto"
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={(e) => {
                if (onNavItemClick) {
                  e.preventDefault()
                  onNavItemClick(item.url)
                }
                setActiveTab(item.name)
              }}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
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
        <div className="flex items-center gap-1">
          <div className={cn("h-6 w-px", theme === 'dark' ? "bg-border/50" : "bg-black")} />

          <div
            onClick={toggleLanguage}
            className="relative cursor-pointer text-sm font-semibold transition-colors text-foreground/80 flex items-center justify-center px-2"
            aria-label="Change language"
          >
            <div className="relative p-1.5">
              <span className={cn("transition-colors", language === 'pt' ? 'text-foreground' : 'text-foreground/50 hover:text-foreground')}>PT</span>
              {language === 'pt' && <motion.div className={cn("absolute bottom-1 left-1.5 right-1.5 h-[1px]", theme === "dark" ? "bg-white shadow-[0_0_4px_#fff]" : "bg-black shadow-[0_0_4px_#000]")} layoutId="language-underline" />}
            </div>
            <div className={cn("h-4 w-px", theme === 'dark' ? "bg-border/50" : "bg-black")} />
            <div className="relative p-1.5">
              <span className={cn("transition-colors", language === 'en' ? 'text-foreground' : 'text-foreground/50 hover:text-foreground')}>EN</span>
              {language === 'en' && <motion.div className={cn("absolute bottom-1 left-1.5 right-1.5 h-[1px]", theme === "dark" ? "bg-white shadow-[0_0_4px_#fff]" : "bg-black shadow-[0_0_4px_#000]")} layoutId="language-underline" />}
            </div>
          </div>
          <ThemeToggle />
        </div>
      </motion.div>
    </div>
  )
} 