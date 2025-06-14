"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { Loader2 } from "lucide-react";

/**
 * Interface para o estado do formulário de contato.
 */
interface FormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Interface para o estado de status do envio do formulário.
 */
interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

/**
 * Seção de Contato com um formulário funcional para enviar emails.
 * Gerencia o estado do formulário, o envio para uma API e exibe feedback ao usuário.
 *
 * @returns {JSX.Element} A seção de Contato renderizada.
 */
export default function Contact() {
  const { t } = useLanguage();
  
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  
  // Estado para o status do envio (carregando, sucesso, erro)
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });

  /**
   * Manipula a mudança nos campos do formulário.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e O evento de mudança.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Manipula o envio do formulário.
   * Envia os dados para a API, gerencia o estado de carregamento e exibe mensagens de sucesso ou erro.
   * @param {React.FormEvent<HTMLFormElement>} e O evento de envio do formulário.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Enviando..." });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Mensagem enviada com sucesso! Obrigado.",
        });
        // Limpa o formulário após o sucesso
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Ocorreu um erro ao enviar a mensagem.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Não foi possível conectar ao servidor. Tente novamente.",
      });
    }
  };

  return (
    <Section title={t('contact.title')} id="contact">
      <div className="container mx-auto px-4 text-center">
        {/* Card do Formulário com animação */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-lg mx-auto p-8 bg-light/80 dark:bg-dark/80 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/20 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("contact.namePlaceholder")}
              required
              className="p-4 rounded-lg bg-white/60 dark:bg-black/40 border border-white/20 dark:border-white/30 shadow-inner shadow-black/10 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("contact.emailPlaceholder")}
              required
              className="p-4 rounded-lg bg-white/60 dark:bg-black/40 border border-white/20 dark:border-white/30 shadow-inner shadow-black/10 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("contact.messagePlaceholder")}
              rows={5}
              required
              className="p-4 rounded-lg bg-white/60 dark:bg-black/40 border border-white/20 dark:border-white/30 shadow-inner shadow-black/10 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            ></textarea>
            <Button
              type="submit"
              variant="ghost"
              disabled={status.type === "loading"}
              className="rounded-xl px-6 py-3 text-base font-semibold
              bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black
              text-black dark:text-white transition-all duration-300
              hover:-translate-y-0.5 border border-black/10 dark:border-white/20
              hover:shadow-lg dark:hover:shadow-neutral-800/50 backdrop-blur-sm w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.type === "loading" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                t("contact.submitButton")
              )}
            </Button>
            {/* Mensagem de status do formulário */}
            {status.type !== 'idle' && (
              <p
                className={`mt-4 text-sm ${
                  status.type === "success"
                    ? "text-green-600 dark:text-green-400"
                    : status.type === "error"
                    ? "text-red-600 dark:text-red-400"
                    : "text-primary dark:text-primaryDark"
                }`}
              >
                {status.message}
              </p>
            )}
          </form>

          {/* Links para redes sociais */}
          <div className="flex justify-center gap-8 mt-8 text-4xl">
            <a
              href="mailto:pedroernestovogado@gmail.com"
              className="hover:text-primary dark:hover:text-primaryDark"
              aria-label="Enviar um email"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://github.com/pedro18x"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary dark:hover:text-primaryDark"
              aria-label="Link para o perfil do GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/pedroernestovogado"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary dark:hover:text-primaryDark"
              aria-label="Link para o perfil do LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
} 