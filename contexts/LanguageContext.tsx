"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import pt from '@/locales/pt.json';

// Define os idiomas suportados
type Language = 'en' | 'pt';

// Estrutura do objeto de tradução
type Translations = typeof en;

// Interface para o contexto de idioma
interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Carrega os arquivos de tradução
const translations: Record<Language, Translations> = { en, pt };

/**
 * Contexto para gerenciar o estado do idioma da aplicação.
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Provedor que encapsula a lógica de troca de idioma e tradução.
 * @param {object} props - As propriedades do componente.
 * @param {ReactNode} props.children - Os componentes filhos que terão acesso ao contexto.
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'pt' ? 'en' : 'pt'));
  }, []);

  /**
   * Função de tradução que busca uma string no arquivo de idioma atual.
   * Navega por um objeto aninhado usando uma chave pontuada (ex: 'nav.home').
   * Se a chave não for encontrada, tenta buscar no idioma de fallback (inglês).
   * @param {string} key - A chave da tradução (ex: "header.title").
   * @returns {string} O texto traduzido ou a própria chave se não for encontrado.
   */
  const t = useCallback((key: string): string => {
    const getNestedValue = (obj: any, path: string): string | undefined => {
      return path.split('.').reduce((acc, part) => acc?.[part], obj);
    };

    const currentTranslation = getNestedValue(translations[language], key);
    if (currentTranslation !== undefined) {
      return currentTranslation;
    }

    // Fallback para inglês se a tradução não for encontrada
    if (language !== 'en') {
      const fallbackTranslation = getNestedValue(translations['en'], key);
      if (fallbackTranslation !== undefined) {
        return fallbackTranslation;
      }
    }
    
    // Retorna a chave se nenhuma tradução for encontrada
    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook customizado para acessar o contexto de idioma.
 * Garante que o hook seja usado dentro de um LanguageProvider.
 * @returns {LanguageContextType} O objeto do contexto de idioma.
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 