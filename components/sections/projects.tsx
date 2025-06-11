"use client";

import { projectsData } from "@/lib/data";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Projects = () => {
  return (
    <section id="projects" className="w-full py-24 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Meus Projetos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl: string;
}

const ProjectCard = ({ title, description, tags, imageUrl, githubUrl }: ProjectCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
    >
      <Image src={imageUrl} alt={title} width={500} height={300} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <Link href={githubUrl} target="_blank" className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 dark:bg-primaryDark dark:text-dark dark:hover:bg-primaryDark/90 transition-colors">
            Ver no GitHub
        </Link>
      </div>
    </motion.div>
  );
};

export default Projects; 