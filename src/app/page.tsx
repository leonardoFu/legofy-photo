import { redirect } from 'next/navigation';
import { fallbackLang } from './i18n/settings';

export default function RootPage() {
  redirect(`/${fallbackLang}`);
} 