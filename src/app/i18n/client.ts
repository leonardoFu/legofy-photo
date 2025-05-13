'use client';

import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions } from './settings';
import { useEffect, useState } from 'react';

// Initialize i18next for client-side
i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`./locales/${language}/${namespace}.json`)
  ))
  .init({
    ...getOptions(),
    lng: undefined, // Let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    }
  });

export function useTranslation(lang: string, ns: string | string[] = 'common', options = {}) {
  const [initialized, setInitialized] = useState(false);
  const ret = useTranslationOrg(ns, options);
  
  useEffect(() => {
    if (i18next.resolvedLanguage !== lang) {
      i18next.changeLanguage(lang);
    }
    setInitialized(true);
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