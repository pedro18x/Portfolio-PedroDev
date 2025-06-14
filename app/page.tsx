"use client";

import { useEffect, useState } from "react";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Stacks from "@/components/sections/stacks";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Briefcase, Home as HomeIcon, Layers, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingPaths } from "@/components/ui/background-paths";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  
  const navItems = [
    { name: t('nav.home'), url: '#home', icon: HomeIcon },
    { name: t('nav.about'), url: '#about', icon: User },
    { name: t('nav.stacks'), url: '#stacks', icon: Layers },
    { name: t('nav.projects'), url: '#projects', icon: Briefcase },
    { name: t('nav.contact'), url: '#contact', icon: Mail },
  ]
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowScrollTop(scrollPosition > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (id: string) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-light dark:bg-dark text-foreground relative">
      <NavBar items={navItems} onNavItemClick={scrollToSection} />

      <div className="fixed top-0 left-0 w-full h-full z-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Main content with improved spacing */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <Hero />
        <About />
        <Stacks />
        <Projects />
        <Contact />
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50"
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

      {/* Footer with subtle gradient */}
      <footer className="w-full py-6 border-t z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>© {new Date().getFullYear()} - {t('footer.text')}</p>
        </div>
      </footer>
    </main>
  );
} 