"use client";

import { createContext, useContext, ReactNode } from "react";
import { translations } from "@/lib/i18n";

type TranslationFunction = (key: string) => string;

interface LanguageContextValue {
  lang: "en";
  setLang: (lang: "en") => void;
  t: TranslationFunction;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const t: TranslationFunction = (key: string) => {
    return getNestedValue(translations.en as unknown as Record<string, unknown>, key);
  };

  return (
    <LanguageContext.Provider value={{ lang: "en", setLang: () => {}, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
