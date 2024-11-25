// src/app/components/SearchBar.tsx
'use client';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search companies..."
          className="w-full px-4 py-3 pl-12 rounded-lg bg-white 
                     border-2 border-zinc-200 
                     focus:border-black focus:outline-none
                     dark:bg-zinc-800 dark:border-zinc-700
                     dark:focus:border-white dark:text-white 
                     transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                          text-zinc-400 dark:text-zinc-500 w-5 h-5" />
      </div>
    </div>
  );
}