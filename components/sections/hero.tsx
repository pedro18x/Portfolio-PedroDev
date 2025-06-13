"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";

const words = ["Olá,", "eu", "sou", "Pedro", "Ernesto."];
const subtitle =
  "Desenvolvedor Full Stack apaixonado por criar soluções inovadoras e eficientes que resolvem problemas do mundo real.";

/**
 * A seção Hero, a primeira coisa que os visitantes veem.
 * Apresenta uma saudação com animação, um subtítulo e um botão de call-to-action.
 *
 * @returns {JSX.Element} A seção Hero renderizada.
 */
export default function Hero() {
  const title = "Pedro Ernesto";
  const buttonText = "Ver Projetos";
  const buttonLink = "#projects";

  return (
    <section id="home" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="max-w-4xl mx-auto"
        >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
                {words.map((word, wordIndex) => (
                    <span
                        key={wordIndex}
                        className="inline-block mr-4 last:mr-0"
                    >
                        {word.split("").map((letter, letterIndex) => (
                            <motion.span
                                key={`${wordIndex}-${letterIndex}`}
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    delay:
                                        wordIndex * 0.1 +
                                        letterIndex * 0.03,
                                    type: "spring",
                                    stiffness: 150,
                                    damping: 25,
                                }}
                                className="inline-block text-transparent bg-clip-text 
                                bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                                dark:from-white dark:to-white/80"
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </span>
                ))}
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700/80 dark:from-white dark:to-white/80"
            >
              {subtitle}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="inline-block group relative"
            >
                <Button
                    variant="ghost"
                    className="rounded-xl px-8 py-6 text-lg font-semibold
                    bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black
                    text-black dark:text-white transition-all duration-300 
                    group-hover:-translate-y-0.5 border border-black/10 dark:border-white/20
                    hover:shadow-xl dark:hover:shadow-neutral-800/50 backdrop-blur-sm"
                    onClick={() => buttonLink && (window.location.href = buttonLink)}
                >
                    <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                        {buttonText}
                    </span>
                    <span
                        className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                        transition-all duration-300"
                    >
                        →
                    </span>
                </Button>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 