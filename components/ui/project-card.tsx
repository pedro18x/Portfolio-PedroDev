"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl: string;
}

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
      className="bg-light/80 dark:bg-dark/80 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/20 shadow-lg overflow-hidden"
    >
      <Image src={imageUrl} alt={title} width={500} height={300} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-200/80 dark:bg-gray-700/80 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <Link href={githubUrl} target="_blank" className="inline-block px-6 py-2 bg-primary/80 text-white rounded-lg hover:bg-primary/90 dark:bg-primaryDark/80 dark:text-dark dark:hover:bg-primaryDark/90 transition-colors">
            Ver no GitHub
        </Link>
      </div>
    </motion.div>
  );
} 