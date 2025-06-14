"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * A seção "Sobre", que exibe uma foto de perfil, uma biografia e links sociais.
 * Utiliza animações 'whileInView' para uma entrada suave quando o usuário rola até a seção.
 *
 * @returns {JSX.Element} A seção "Sobre" renderizada.
 */
export default function About() {
  const { t, language } = useLanguage();

  // Agrupa textos e links para melhor organização
  const content = {
    title: t('about.title'),
    bio: t('about.bio'),
    githubUrl: "https://github.com/pedro18x",
    linkedinUrl: "https://linkedin.com/in/pedroernestovogado",
    cvPath: language === 'pt' ? '/curriculo.pdf' : '/resume.pdf',
    cvFilename: language === 'pt' ? 'Pedro-Ernesto-Curriculo.pdf' : 'Pedro-Ernesto-Resume.pdf',
  };

  return (
    <section id="about" className="w-full py-24">
      <div className="container mx-auto">
        <div className="p-8 bg-light/80 dark:bg-dark/80 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/20 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-4">
            {/* Animação da imagem de perfil */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="https://github.com/pedro18x.png"
                alt="Pedro Ernesto"
                width={300}
                height={300}
                className="rounded-full shadow-lg border-4 border-white/50"
              />
            </motion.div>
            
            {/* Animação do bloco de texto */}
            <motion.div
              className="max-w-xl text-center md:text-left"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-4">{content.title}</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {content.bio}
              </p>
              <div className="flex justify-center md:justify-start items-center gap-6 text-4xl">
                <a 
                  href={content.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary dark:hover:text-primaryDark transition-colors"
                  aria-label="Link para o perfil do GitHub"
                >
                  <FaGithub />
                </a>
                <a 
                  href={content.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary dark:hover:text-primaryDark transition-colors"
                  aria-label="Link para o perfil do LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a 
                  href={content.cvPath} 
                  download={content.cvFilename} 
                  className="hover:text-primary dark:hover:text-primaryDark transition-colors"
                  aria-label="Link para baixar o currículo"
                >
                  <Download size={36} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}; 