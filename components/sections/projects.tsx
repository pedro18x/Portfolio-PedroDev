"use client";

import { motion } from "framer-motion";

import { ProjectCard } from "@/components/ui/project-card";
import { Section } from "@/components/ui/section";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects as projectData } from "@/lib/data";

/**
 * Variantes de animação para os cards de projeto.
 * Define um fade-in e slide-up com um atraso dinâmico.
 */
const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

/**
 * Seção que exibe os projetos do portfólio.
 * Mapeia os dados dos projetos, traduz os textos e renderiza um `ProjectCard` animado para cada um.
 *
 * @returns {JSX.Element} A seção "Projetos" renderizada.
 */
export default function Projects() {
  const { t } = useLanguage();
  
  // Combina os dados estruturais com os textos traduzidos
  const translatedProjects = projectData.map(project => ({
    ...project,
    title: t(project.titleKey),
    description: t(project.descriptionKey),
  }));

  return (
    <Section title={t('projects.title')} id="projects">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {translatedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            custom={index}
            className="h-full"
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
} 