"use client";

import { useLanguage } from "@/contexts/LanguageContext";

/**
 * O componente de rodapé da aplicação.
 * Exibe o ano atual e uma mensagem de direitos autorais traduzida.
 *
 * @returns {JSX.Element} O rodapé renderizado.
 */
export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-6 border-t z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <p>
          © {new Date().getFullYear()} - {t("footer.text")}
        </p>
      </div>
    </footer>
  );
} 