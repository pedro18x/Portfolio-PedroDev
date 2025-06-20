import { Code2, FileCode, Globe, Palette, Atom, Server, Zap, Database, GitBranch, BookOpen } from 'lucide-react';
import React from 'react';

/**
 * Interface para representar uma tecnologia ou ferramenta.
 */
export interface Technology {
  id: string;
  name: string;
  icon: React.ReactNode;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

/**
 * Lista de tecnologias e ferramentas com seus respectivos ícones e níveis de proficiência.
 */
export const technologies: Technology[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: <Code2 className="w-8 h-8" />,
    level: 'Advanced',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: <FileCode className="w-8 h-8" />,
    level: 'Advanced',
  },
  {
    id: 'html',
    name: 'HTML',
    icon: <Globe className="w-8 h-8" />,
    level: 'Expert',
  },
  {
    id: 'css',
    name: 'CSS',
    icon: <Palette className="w-8 h-8" />,
    level: 'Advanced',
  },
  {
    id: 'react',
    name: 'React',
    icon: <Atom className="w-8 h-8" />,
    level: 'Advanced',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: <Server className="w-8 h-8" />,
    level: 'Advanced',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: <Zap className="w-8 h-8" />,
    level: 'Intermediate',
  },
  {
    id: 'expressjs',
    name: 'Express.js',
    icon: <Server className="w-8 h-8" />,
    level: 'Intermediate',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: <Database className="w-8 h-8" />,
    level: 'Intermediate',
  },
  {
    id: 'git',
    name: 'Git/GitHub',
    icon: <GitBranch className="w-8 h-8" />,
    level: 'Advanced',
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: <BookOpen className="w-8 h-8" />,
    level: 'Advanced',
  }
];

/**
 * Interface para representar a estrutura de um projeto.
 */
export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  imageUrl: string;
  githubUrl: string;
}

/**
 * Lista com os dados estruturais dos projetos.
 * Os textos são referenciados por chaves para permitir a tradução.
 */
export const projects: Project[] = [
  {
    id: 'bancoNext',
    titleKey: "projects.bancoNext.title",
    descriptionKey: "projects.bancoNext.description",
    tags: ["Next.js", "Appwrite", "Plaid", "Dwolla", "TypeScript"],
    imageUrl: "/banco-next.png",
    githubUrl: "https://github.com/pedro18x/banconext"
  },
  {
    id: 'nlwJs',
    titleKey: "projects.nlwJs.title",
    descriptionKey: "projects.nlwJs.description",
    tags: ["JavaScript", "Node.js", "React", "API Rest"],
    imageUrl: "/nlw-js.png",
    githubUrl: "https://github.com/pedro18x/in.orbit"
  },
  {
    id: 'zingen',
    titleKey: "projects.zingen.title",
    descriptionKey: "projects.zingen.description",
    tags: ["HTML", "CSS"],
    imageUrl: "/zingen.png",
    githubUrl: "https://github.com/pedro18x/Zingen-RS6-"
  }
]; 