"use client";

import { useEffect, useState, useCallback } from "react";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Stacks from "@/components/sections/stacks";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Briefcase,
  Home as HomeIcon,
  Layers,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingPaths } from "@/components/ui/background-paths";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/layout/footer";

/**
 * Componente principal do lado do cliente para a página inicial.
 * Gerencia a lógica de interatividade, como navegação por rolagem e o botão "scroll to top",
 * e monta a estrutura da página com todas as suas seções.
 *
 * @returns {JSX.Element} A página inicial completa e interativa.
 */
export function HomeClient() {
  const { t } = useLanguage();

  const navItems = [
    { name: t("nav.home"), url: "#home", icon: HomeIcon },
    { name: t("nav.about"), url: "#about", icon: User },
    { name: t("nav.stacks"), url: "#stacks", icon: Layers },
    { name: t("nav.projects"), url: "#projects", icon: Briefcase },
    { name: t("nav.contact"), url: "#contact", icon: Mail },
  ];
  
  // Estado para controlar a visibilidade do botão "Scroll to Top"
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Estado para controlar qual seção está ativa
  const [activeSection, setActiveSection] = useState("#home");

  // Efeito para adicionar um listener de rolagem que mostra/esconde o botão e atualiza a seção ativa
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      // Scroll spy - detecta qual seção está visível
      const sections = ["#home", "#about", "#stacks", "#projects", "#contact"];
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Se estamos próximos do final da página, ativa a última seção
      if (scrollPosition + windowHeight >= documentHeight - 100) {
        setActiveSection("#contact");
        return;
      }

      // Detecta a seção ativa baseada na posição do scroll
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.querySelector(sections[i]);
        if (section) {
          const sectionTop = (section as HTMLElement).offsetTop;
          const sectionHeight = (section as HTMLElement).offsetHeight;
          const sectionBottom = sectionTop + sectionHeight;
          
          // Considera uma seção ativa se o meio da viewport está dentro dela
          const viewportMiddle = scrollPosition + windowHeight / 2;
          
          if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Chama uma vez para definir a seção inicial
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Rola a página suavemente para o topo.
   */
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  /**
   * Rola a página suavemente para uma seção específica.
   * @param {string} id O seletor de ID da seção (ex: "#about").
   */
  const scrollToSection = useCallback((id: string) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-light dark:bg-dark text-foreground relative">
      <NavBar items={navItems} onNavItemClick={scrollToSection} activeSection={activeSection} />

      <div className="fixed top-0 left-0 w-full h-full z-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Conteúdo Principal */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <Hero onButtonClick={scrollToSection} />
        <About />
        <Stacks />
        <Projects />
        <Contact />
      </div>

      {/* Botão Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-4 sm:right-8 z-40"
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className="rounded-full shadow-lg"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
} 