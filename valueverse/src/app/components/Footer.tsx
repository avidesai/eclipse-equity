// src/app/components/Footer.tsx
'use client';
import { Mail } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/favicon.svg" 
              alt="ValueVerse Logo" 
              width={24} 
              height={24} 
              className="dark:invert"
            />
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Mail className="w-4 h-4" />
              <a 
                href="mailto:support@valueverse.pro"
                className="text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-200"
              >
                support@valueverse.pro
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}