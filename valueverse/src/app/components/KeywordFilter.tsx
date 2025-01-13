// 

import React, { useMemo } from 'react';
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
  const keywordCounts = useMemo(() => {
    const counts = new Map<string, { count: number; emoji: string }>();
    
    stocks.forEach(stock => {
      stock.keywords?.forEach(keyword => {
        const existing = counts.get(keyword.text);
        if (existing) {
          counts.set(keyword.text, { 
            count: existing.count + 1, 
            emoji: keyword.emoji 
          });
        } else {
          counts.set(keyword.text, { count: 1, emoji: keyword.emoji });
        }
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([text, { count, emoji }]) => ({ text, emoji, count }));
  }, [stocks]);

  return (
    <div className="flex flex-wrap gap-2 mt-4 max-w-3xl mx-auto">
      {keywordCounts.map((keyword) => {
        const isSelected = selectedKeywords.some(k => k.text === keyword.text);
        return (
          <motion.button
            key={keyword.text}
            onClick={() => onKeywordSelect({ text: keyword.text, emoji: keyword.emoji })}
            className={`px-3 py-1.5 rounded-full text-sm transition-all
              ${isSelected ? 
                'bg-black text-white dark:bg-white dark:text-black shadow-md' : 
                'bg-white text-zinc-600 border-2 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1.5">{keyword.emoji}</span>
            <span>{keyword.text}</span>
            <span className="ml-1.5 opacity-50">({keyword.count})</span>
          </motion.button>
        );
      })}
    </div>
  );
}