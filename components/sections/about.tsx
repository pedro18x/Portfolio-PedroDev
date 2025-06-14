"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * A seção "Sobre", que exibe uma foto, uma breve biografia e links para redes sociais.
 *
 * @returns {JSX.Element} A seção "Sobre" renderizada.
 */
export default function About() {
  const { t, language } = useLanguage();
  return (
    <section id="about" className="w-full py-24">
      <div className="container mx-auto">
        <div className="p-8 bg-light/80 dark:bg-dark/80 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/20 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-4">
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
            <motion.div
              className="max-w-xl text-center md:text-left"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-4">{t('about.title')}</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {t('about.bio')}
              </p>
              <div className="flex justify-center md:justify-start items-center gap-6 text-4xl">
                <a href="https://github.com/pedro18x" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primaryDark transition-colors">
                  <FaGithub />
                </a>
                <a href="https://linkedin.com/in/pedroernestovogado" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primaryDark transition-colors">
                  <FaLinkedin />
                </a>
                <a 
                  href={language === 'pt' ? '/curriculo.pdf' : '/resume.pdf'} 
                  download={language === 'pt' ? 'Pedro-Ernesto-Curriculo.pdf' : 'Pedro-Ernesto-Resume.pdf'} 
                  className="hover:text-primary dark:hover:text-primaryDark transition-colors"
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