'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language files
import enTranslation from '../locales/en.json';
import ruTranslation from '../locales/ru.json';

// Initialize i18next - only on client side
const initializeI18n = () => {
  if (typeof window === 'undefined') return;
  
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enTranslation
        },
        ru: {
          translation: ruTranslation
        }
      },
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ['querystring', 'localStorage', 'navigator'],
        lookupQuerystring: 'lang'
      }
    });
};

// Initialize i18n on the client side only
if (typeof window !== 'undefined') {
  initializeI18n();
}

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languages: { code: Language; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ru'); // Default for SSR

  useEffect(() => {
    // This code only runs in the browser
    // Check URL query parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam === 'en' || langParam === 'ru') {
      setLanguageState(langParam);
      return;
    }
    
    // Then check localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'en' || savedLang === 'ru') {
      setLanguageState(savedLang);
      return;
    }
  }, []);

  const languages = [
    { code: 'ru' as Language, name: 'Русский' },
    { code: 'en' as Language, name: 'English' }
  ];

  const setLanguage = (lang: Language) => {
    if (typeof window !== 'undefined') {
      i18n.changeLanguage(lang);
      setLanguageState(lang);
      localStorage.setItem('language', lang);
      
      // Update URL if needed (without page refresh)
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Check for URL language parameter changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      if ((langParam === 'en' || langParam === 'ru') && langParam !== language) {
        setLanguage(langParam);
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [language]);

  // Initialize language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};
