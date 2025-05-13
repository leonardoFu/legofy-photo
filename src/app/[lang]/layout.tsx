'use client';

import { dir } from 'i18next';
import "./globals.css";
import { useEffect } from 'react';
import i18next from 'i18next';
import { use } from 'react';

type Params = Promise<{
  lang: string;
}>;

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: Params
}) {
  // Unwrap the params object using React.use() if it's a promise
  const { lang } = use(params);
  
  // Initialize i18next on the client side
  useEffect(() => {
    // Set language attributes on html element
    document.documentElement.lang = lang;
    document.documentElement.dir = dir(lang);
    
    // Ensure i18next is using the correct language
    if (i18next.resolvedLanguage !== lang) {
      i18next.changeLanguage(lang);
    }
  }, [lang]);

  return children;
}
