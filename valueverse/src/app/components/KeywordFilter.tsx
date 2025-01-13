// src/app/components/KeywordFilter.tsx

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Stock } from '../types/stock';
import { motion } from 'framer-motion';

interface KeywordFilterProps {
  stocks: Stock[];
  selectedKeyword: { text: string; emoji: string } | null;
  onKeywordSelect: (keyword: { text: string; emoji: string }) => void;
}

export default function KeywordFilter({
  stocks,
  selectedKeyword,
  onKeywordSelect
}: KeywordFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

  const keywords = useMemo(() => {
    // Create a map to count keyword occurrences
    const keywordCounts = new Map<string, { count: number; emoji: string }>();
    
    // Count occurrences of each keyword
    stocks.forEach(stock => {
      stock.keywords?.forEach(keyword => {
        const existing = keywordCounts.get(keyword.text);
        if (existing) {
          existing.count++;
        } else {
          keywordCounts.set(keyword.text, { count: 1, emoji: keyword.emoji });
        }
      });
    });

    // Convert to array and sort by count
    const sortedKeywords = Array.from(keywordCounts.entries())
      .map(([text, { count, emoji }]) => ({
        text,
        emoji,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7) // Limit to 7 keywords to make room for "All"
      .map(({ text, emoji }) => ({ text, emoji }));

    // Add "All" category at the beginning
    return [
      { text: 'All', emoji: '🌎' },
      ...sortedKeywords
    ];
  }, [stocks]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftShadow(scrollLeft > 0);
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative max-w-3xl mx-auto mt-4 h-10">
      {/* Left Shadow Gradient */}
      <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-50 to-transparent dark:from-zinc-900 pointer-events-none z-10 transition-opacity duration-200 ${
        showLeftShadow ? 'opacity-100' : 'opacity-0'
      }`} />
      
      {/* Right Shadow Gradient */}
      <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-50 to-transparent dark:from-zinc-900 pointer-events-none z-10 transition-opacity duration-200 ${
        showRightShadow ? 'opacity-100' : 'opacity-0'
      }`} />
      
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto whitespace-nowrap hide-scrollbar"
      >
        <div className="inline-flex gap-2 px-2 pb-4">
          {keywords.map((keyword) => {
            const isSelected = selectedKeyword 
              ? selectedKeyword.text === keyword.text 
              : keyword.text === 'All';
              
            return (
              <motion.button
                key={keyword.text}
                onClick={() => onKeywordSelect(keyword)}
                className={`inline-flex items-center px-3 h-8 rounded-full text-sm transition-all
                  ${isSelected
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                    : 'bg-white text-zinc-600 border-2 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1.5">{keyword.emoji}</span>
                <span className="whitespace-nowrap">{keyword.text}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Custom CSS for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}