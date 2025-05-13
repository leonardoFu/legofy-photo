"use client";

import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface FooterProps {
  lang: string;
  footerText: string;
}

export function Footer({ lang, footerText }: FooterProps) {
  return (
    <footer className="bg-blue-700 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              </div>
              <span className="font-bold">Legofy Photo</span>
            </div>
            <p className="text-xs md:text-sm mt-1 text-blue-200">
              {footerText}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <LanguageSwitcher lang={lang} />
            <p className="text-xs md:text-sm text-blue-200">© {new Date().getFullYear()} Legofy Photo</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 