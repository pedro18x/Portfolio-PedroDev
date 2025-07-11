"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/ui/project-card";
import { Section } from "@/components/ui/section";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects as projectData } from "@/lib/data";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTOPLAY_INTERVAL = 5000; // 5 seconds between transitions

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

export default function Projects() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const translatedProjects = projectData.map(project => ({
    ...project,
    title: t(project.titleKey),
    description: t(project.descriptionKey),
  }));

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % translatedProjects.length);
  }, [translatedProjects.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? translatedProjects.length - 1 : prev - 1
    );
  };

  // Auto-play functionality
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        handleNext();
      }, AUTOPLAY_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoPlaying, handleNext]);

  // Calculate indices for visible projects (current + next two)
  const visibleIndices = [
    currentIndex,
    (currentIndex + 1) % translatedProjects.length,
    (currentIndex + 2) % translatedProjects.length,
  ];

  return (
    <Section title={t('projects.title')} id="projects">
      <div 
        className="relative w-full px-4"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative flex justify-center items-center">
          <button
            onClick={handlePrev}
            className="absolute -left-16 z-10 p-2 rounded-full bg-white/80 dark:bg-black/80 shadow-lg border border-black/10 dark:border-white/20 hover:scale-110 transition-transform"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-8 justify-center items-stretch min-h-[500px] w-full max-w-[1200px]">
            <AnimatePresence mode="popLayout">
              {visibleIndices.map((projectIndex, i) => (
                <motion.div
                  key={translatedProjects[projectIndex].id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full md:w-[350px] flex-none"
                >
                  <ProjectCard {...translatedProjects[projectIndex]} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            onClick={handleNext}
            className="absolute -right-16 z-10 p-2 rounded-full bg-white/80 dark:bg-black/80 shadow-lg border border-black/10 dark:border-white/20 hover:scale-110 transition-transform"
            aria-label="Next project"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {translatedProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                visibleIndices.includes(index)
                  ? "bg-primary w-4"
                  : "bg-primary/30"
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
} 