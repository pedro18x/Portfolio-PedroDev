"use client";

import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className="w-full py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">Entre em Contato</h2>
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
              placeholder="Seu Nome"
              className="p-4 rounded-lg bg-gray-300/30 dark:bg-gray-700/30 border border-white/20 dark:border-white/30 shadow-inner shadow-black/10 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <input
              type="email"
              placeholder="Seu E-mail"
              className="p-4 rounded-lg bg-gray-300/30 dark:bg-gray-700/30 border border-white/20 dark:border-white/30 shadow-inner shadow-black/10 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <textarea
              placeholder="Sua Mensagem"
              rows={5}
              className="p-4 rounded-lg bg-gray-300/30 dark:bg-gray-700/30 border border-white/20 dark:border-white/30 shadow-inner shadow-black/10 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            ></textarea>
            <button type="submit" className="px-6 py-3 bg-primary/80 text-white rounded-lg hover:bg-primary/90 dark:bg-primaryDark/80 dark:text-dark dark:hover:bg-primaryDark/90 transition-colors">
              Enviar Mensagem
            </button>
          </form>
          <div className="flex justify-center gap-8 mt-8 text-4xl">
            <a href="mailto:pedroernestovogado@gmail.com" className="hover:text-primary dark:hover:text-primaryDark">
              <FaEnvelope />
            </a>
            <a href="https://github.com/pedro18x" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primaryDark">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/pedroernestovogado" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primaryDark">
              <FaLinkedin />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 