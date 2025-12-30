"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, dictionary } from "@/constants/dictionary";

// Re-export Language type for convenience
export type { Language };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof dictionary.vi;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("vi");

  // Load language from localStorage on mount (default to Vietnamese if not set)
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    const validLanguages: Language[] = ["vi", "en", "id", "fil", "km"];
    if (savedLang && validLanguages.includes(savedLang)) {
      setLangState(savedLang);
    } else {
      // Default to Vietnamese if no saved language
      setLangState("vi");
      localStorage.setItem("lang", "vi");
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionary[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}




