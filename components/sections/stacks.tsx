"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { technologies } from '@/lib/data';

/**
 * Variantes de animação para o contêiner dos cards.
 * Define uma transição escalonada ('stagger') para os filhos.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

/**
 * Variantes de animação para cada card individual.
 * Define uma animação de fade-in e slide-up.
 */
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

/**
 * Seção que exibe uma grade de tecnologias e ferramentas.
 * Cada tecnologia é mostrada em um card com um ícone e nome.
 * A seção e os cards são animados na entrada.
 *
 * @returns {JSX.Element} A seção de stacks renderizada.
 */
const Stacks: React.FC = () => {
  const { t } = useLanguage();

  const content = {
    title: t('stacks.title'),
    subtitle: t('stacks.subtitle'),
  };

  return (
    <section id="stacks" className="py-24 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Título e subtítulo da seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">{content.title}</h2>
          <p className="text-lg text-primary dark:text-primaryDark max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Grade de tecnologias */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.id}
              variants={itemVariants}
              className="h-full"
            >
              {/* Card da Tecnologia */}
              <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm p-6 h-full bg-cardLight dark:bg-card/50 border-borderLight dark:border-border backdrop-blur-sm hover:border-primary/50 dark:hover:border-primary/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <div className="flex flex-col items-center justify-center text-center space-y-4 h-full">
                  <motion.div
                    className="text-primary dark:text-primaryDark"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {tech.icon}
                  </motion.div>
                  
                  <div className="flex-grow flex items-center justify-center">
                    <h3 className="text-xl font-semibold">
                      {tech.name}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stacks;