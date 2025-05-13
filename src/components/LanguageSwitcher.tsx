'use client';

import { usePathname, useRouter } from 'next/navigation';
import { languages } from '@/app/i18n/settings';
import { Languages } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LanguageSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    zh: '中文',
    jp: '日本語'
  };

  const handleLanguageChange = (newLang: string) => {
    if (newLang === lang) return;
    
    const currentPathWithoutLang = pathname.replace(`/${lang}`, '');
    const newPath = `/${newLang}${currentPathWithoutLang}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center">
      <Select value={lang} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px] h-8 bg-blue-600 text-white border-blue-500 hover:bg-blue-500 focus:ring-0 text-sm">
          <Languages className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((code) => (
            <SelectItem key={code} value={code}>
              {languageNames[code as keyof typeof languageNames] || code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 