"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MatrixText } from "../ui/matrix-text";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * A seção Hero, a primeira coisa que os visitantes veem.
 * Apresenta uma saudação com animação, um subtítulo e um botão de call-to-action.
 *
 * @returns {JSX.Element} A seção Hero renderizada.
 */
export default function Hero() {
  const { t } = useLanguage();
  const introText = t('hero.intro');
  const nameText = t('hero.name');
  const subtitle = t('hero.subtitle');
  const buttonText = t('hero.button');
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
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tighter">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 25 }}
                    className="mb-4"
                >
                    {introText}
                </motion.div>
                <div className="flex items-center justify-center">
                    <MatrixText
                        text={nameText}
                        loop={true}
                        loopDelay={3000}
                        initialDelay={1000}
                        letterAnimationDuration={300}
                        letterInterval={50}
                        className="text-black dark:text-white"
                    />
                    <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">.</span>
                </div>
            </div>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium"
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