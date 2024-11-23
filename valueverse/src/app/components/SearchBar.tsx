// src/app/components/SearchBar.tsx
'use client';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search companies..."
          className="w-full px-4 py-3 pl-12 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 
                   dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 
                   dark:focus:ring-zinc-400 dark:text-white transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
      </div>
    </div>
  );
}