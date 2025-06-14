"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

/**
 * A seção "Contato", que exibe ícones e links para as formas de contato do usuário.
 *
 * @returns {JSX.Element} A seção "Contato" renderizada.
 */
export default function Contact() {
  const { t } = useLanguage();

  return (
    <Section title={t('contact.title')} id="contact">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-lg mx-auto p-8 bg-light/80 dark:bg-dark/80 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/20 shadow-lg"
        >
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder={t("contact.namePlaceholder")}
              className="p-4 rounded-lg bg-white/60 dark:bg-black/40 border border-white/20 dark:border-white/30 shadow-inner shadow-black/10 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <input
              type="email"
              placeholder={t("contact.emailPlaceholder")}
              className="p-4 rounded-lg bg-white/60 dark:bg-black/40 border border-white/20 dark:border-white/30 shadow-inner shadow-black/10 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <textarea
              placeholder={t("contact.messagePlaceholder")}
              rows={5}
              className="p-4 rounded-lg bg-white/60 dark:bg-black/40 border border-white/20 dark:border-white/30 shadow-inner shadow-black/10 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            ></textarea>
            <Button
              type="submit"
              variant="ghost"
              className="rounded-xl px-6 py-3 text-base font-semibold
              bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black
              text-black dark:text-white transition-all duration-300
              hover:-translate-y-0.5 border border-black/10 dark:border-white/20
              hover:shadow-lg dark:hover:shadow-neutral-800/50 backdrop-blur-sm w-full mt-4"
            >
              {t("contact.submitButton")}
            </Button>
          </form>

          <div className="flex justify-center gap-8 mt-8 text-4xl">
            <a
              href="mailto:pedroernestovogado@gmail.com"
              className="hover:text-primary dark:hover:text-primaryDark"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://github.com/pedro18x"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary dark:hover:text-primaryDark"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/pedroernestovogado"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary dark:hover:text-primaryDark"
            >
              <FaLinkedin />
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
} 