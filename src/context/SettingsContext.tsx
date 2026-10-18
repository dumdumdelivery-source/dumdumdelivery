import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, type Language, type Theme, type TranslationKey } from "../i18n/translations";

interface SettingsContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("dumdum_theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch {}
    return "light"; // Default Light
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("dumdum_language");
      if (saved === "en" || saved === "ta") return saved;
    } catch {}
    return "en"; // Default English
  });

  useEffect(() => {
    try {
      localStorage.setItem("dumdum_theme", theme);
    } catch {}

    if (theme === "dark") {
      document.documentElement.classList.add("dark-theme");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-theme");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("dumdum_language", language);
    } catch {}
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[language] || translations.en;
    return (dict as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;
  };

  return (
    <SettingsContext.Provider value={{ theme, language, setTheme, setLanguage, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
