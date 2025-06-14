"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Button } from "./button";
import { CardBody, CardContainer, CardItem } from "./3d-card";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl: string;
}

// Easter egg :D

/**
 * Um card 3D interativo para exibir informações de um projeto.
 * Utiliza o componente `CardContainer` para criar um efeito de perspectiva ao passar o mouse.
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
  return (
    <CardContainer containerClassName="py-0 h-full" className="h-full">
      <CardBody className="bg-card/30 dark:bg-card/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-white/[0.2] dark:bg-black/40 dark:border-white/20 border-black/10 w-auto h-full rounded-2xl p-6 border shadow-lg flex flex-col">
        {/* Título do projeto com efeito 3D */}
        <CardItem
          translateZ="50"
          className="text-2xl font-bold mb-2 text-foreground"
        >
          {title}
        </CardItem>
        {/* Descrição do projeto com efeito 3D */}
        <CardItem
          as="p"
          translateZ="60"
          className="text-muted-foreground mb-4 text-sm"
        >
          {description}
        </CardItem>
        {/* Imagem do projeto com efeito 3D */}
        <CardItem translateZ="80" className="w-full mt-4">
          <Image
            src={imageUrl}
            height="1000"
            width="1000"
            className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt={`Imagem de demonstração do projeto ${title}`}
          />
        </CardItem>
        {/* Tags de tecnologia */}
        <div className="flex flex-wrap gap-2 my-4">
          {tags.map((tag, index) => (
            <CardItem
              translateZ={40}
              key={index}
              className="px-3 py-1 bg-secondary/80 text-sm rounded-full"
            >
              {tag}
            </CardItem>
          ))}
        </div>
        {/* Espaçador para empurrar o botão para baixo */}
        <div className="flex-grow" />
        {/* Botão de link para o GitHub com efeito 3D */}
        <CardItem translateZ={20} className="w-full mt-4">
            <Button asChild variant="ghost" className="w-full rounded-xl px-6 py-3 text-base font-semibold bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black text-black dark:text-white transition-all duration-300 hover:-translate-y-0.5 border border-black/10 dark:border-white/20 hover:shadow-lg dark:hover:shadow-neutral-800/50 backdrop-blur-sm">
                <Link href={githubUrl} target="_blank" aria-label={`Ver o código do projeto ${title} no GitHub`}>
                    <FaGithub className="mr-2 h-4 w-4" /> GitHub
                </Link>
            </Button>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
} 