"use client";

import { projectsData } from "@/lib/data";
import { ProjectCard } from "@/components/ui/project-card";

export default function Projects() {
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
} 