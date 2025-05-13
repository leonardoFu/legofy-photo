'use client';

import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions, languages } from './settings';
import { useEffect, useState } from 'react';

// Flag to track if initialization has started
let isInitialized = false;

// Initialize i18next for client-side
const initI18next = async () => {
  if (!isInitialized) {
    isInitialized = true;
    await i18next
      .use(initReactI18next)
      .use(resourcesToBackend((language: string, namespace: string) => 
        import(`./locales/${language}/${namespace}.json`)
      ))
      .init({
        ...getOptions(),
        lng: undefined, // Will be set later
        fallbackLng: 'en',
        preload: languages, // Preload all languages
        detection: {
          order: ['path', 'htmlTag', 'cookie', 'navigator'],
        }
      });
  }
  return i18next;
};

// Start initialization immediately in client
if (typeof window !== 'undefined') {
  initI18next().catch(console.error);
}

export function useTranslation(lang: string, ns: string | string[] = 'common', options = {}) {
  const [initialized, setInitialized] = useState(false);
  const ret = useTranslationOrg(ns, options);
  
  useEffect(() => {
    const handleLanguageChange = async () => {
      try {
        // Ensure i18next is initialized
        await initI18next();
        
        // Set the language
        if (i18next.resolvedLanguage !== lang) {
          await i18next.changeLanguage(lang);
        }
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18next:', error);
      }
    };
    
    handleLanguageChange();
  }, [lang]);
  
  // If not initialized and on client side, return a simple function that returns the key
  if (!initialized && typeof window !== 'undefined') {
    return {
      t: (key: string) => key,
      i18n: i18next
    };
  }
  
  return ret;
} 