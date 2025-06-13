"use client";

import { motion } from "framer-motion";

import { projectsData } from "@/lib/data";
import { ProjectCard } from "@/components/ui/project-card";
import { Section } from "@/components/ui/section";

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
 * A seção "Projetos", que mapeia os dados de projetos e renderiza um `ProjectCard` para cada um,
 * com animações de entrada.
 *
 * @returns {JSX.Element} A seção "Projetos" renderizada.
 */
export default function Projects() {
  return (
    <Section title="Meus Projetos" id="projects">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project, index) => (
          <motion.div
            key={index}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            custom={index}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
} 