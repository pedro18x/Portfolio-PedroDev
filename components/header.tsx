"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/theme-toggle";

/**
 * O cabeçalho principal do site, contendo a navegação e o seletor de tema.
 * É fixo no topo da página e tem um efeito de desfoque ao rolar.
 *
 * @returns {JSX.Element} O componente de cabeçalho renderizado.
 */
export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-light/80 dark:bg-dark/80 backdrop-blur-sm">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="text-2xl font-bold">
          Pedro Ernesto
        </Link>
      </motion.div>
      <nav className="flex items-center gap-8">
        <motion.a
          href="#about"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hover:text-primary dark:hover:text-primaryDark"
        >
          Sobre
        </motion.a>
        <motion.a
          href="#projects"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="hover:text-primary dark:hover:text-primaryDark"
        >
          Projetos
        </motion.a>
        <motion.a
          href="#contact"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="hover:text-primary dark:hover:text-primaryDark"
        >
          Contato
        </motion.a>
        <ThemeToggle />
      </nav>
    </header>
  );
}; 