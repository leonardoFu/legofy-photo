export const fallbackLang = 'en';
export const languages = [fallbackLang, 'es', 'fr', 'de', 'zh', 'jp'];
export const cookieName = 'i18next';

export const getOptions = (lang = fallbackLang, ns = 'common') => {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng: fallbackLang,
    lng: lang,
    fallbackNS: 'common',
    defaultNS: 'common',
    ns
  };
}; 