import { languages } from '../i18n/settings';

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
} 