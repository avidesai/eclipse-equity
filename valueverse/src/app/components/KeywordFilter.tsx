// src/app/components/KeywordFilter.tsx

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Stock } from '../types/stock';
import { motion } from 'framer-motion';

interface KeywordFilterProps {
  stocks: Stock[];
  selectedKeywords: Array<{ text: string; emoji: string }>;
  onKeywordSelect: (keyword: { text: string; emoji: string }) => void;
}

export default function KeywordFilter({
  stocks,
  selectedKeywords,
  onKeywordSelect
}: KeywordFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

  const keywords = useMemo(() => {
    const uniqueKeywords = new Map<string, string>();
    stocks.forEach(stock => {
      if (stock.keywords?.[0]) { // Only take the first keyword (industry) from each stock
        const keyword = stock.keywords[0];
        if (!uniqueKeywords.has(keyword.text)) {
          uniqueKeywords.set(keyword.text, keyword.emoji);
        }
      }
    });
    return Array.from(uniqueKeywords.entries())
      .slice(0, 8)
      .map(([text, emoji]) => ({ text, emoji }));
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
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleKeywordClick = (keyword: { text: string; emoji: string }) => {
    if (selectedKeywords.some(k => k.text === keyword.text)) {
      // If clicking the already selected keyword, deselect it
      onKeywordSelect({ text: '', emoji: '' }); // Clear selection
    } else {
      // Select only this keyword
      onKeywordSelect(keyword);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto mt-4 h-10 hidden sm:block">
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
            const isSelected = selectedKeywords.some(k => k.text === keyword.text);
            return (
              <motion.button
                key={keyword.text}
                onClick={() => handleKeywordClick(keyword)}
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