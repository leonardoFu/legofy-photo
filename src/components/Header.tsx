"use client";

import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-red-600 shadow-lg">
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-yellow-400"></div>
            <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-blue-500"></div>
            <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-green-500"></div>
            <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-red-400"></div>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Legofy Photo</h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/leonardoFu/legofy-photo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-300 transition-colors"
          >
            <Github className="h-5 md:h-6 w-5 md:w-6" />
          </a>
        </div>
      </div>
    </header>
  );
} 