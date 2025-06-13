"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Button } from "./button";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl: string;
}

/**
 * Um card para exibir informações de um projeto, incluindo título, descrição, tecnologias e links.
 *
 * @param {ProjectCardProps} props - As propriedades do card de projeto.
 * @param {string} props.title - O título do projeto.
 * @param {string} props.description - A descrição do projeto.
 * @param {string[]} props.tags - Uma lista de tecnologias usadas no projeto.
 * @param {string} props.imageUrl - A URL da imagem de demonstração do projeto.
 * @param {string} props.githubUrl - A URL para o repositório do projeto no GitHub.
 * @returns {JSX.Element} O componente de card de projeto renderizado.
 */
export function ProjectCard({ title, description, tags, imageUrl, githubUrl }: ProjectCardProps) {
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
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-card/30 dark:bg-card/50 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/20 shadow-lg overflow-hidden group h-full flex flex-col"
    >
      <div className="overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          width={500}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-secondary/80 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-grow" />
        <Button
          asChild
          variant="ghost"
          className="rounded-xl px-6 py-3 text-base font-semibold
          bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black
          text-black dark:text-white transition-all duration-300
          group-hover:-translate-y-0.5 border border-black/10 dark:border-white/20
          hover:shadow-lg dark:hover:shadow-neutral-800/50 backdrop-blur-sm w-full mt-4"
        >
          <Link href={githubUrl} target="_blank">
            <FaGithub className="mr-2 h-4 w-4" /> Ver no GitHub
          </Link>
        </Button>
      </div>
    </motion.div>
  );
} 