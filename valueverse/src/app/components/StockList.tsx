// src/app/components/StockList.tsx
'use client';
import { Stock } from '../types/stock';
import { useMemo, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface StockListProps {
  onSelectStock: (stock: Stock) => void;
  selectedStock: Stock | null;
  stocks: Stock[];
  searchQuery: string;
}

export default function StockList({ 
  onSelectStock, 
  selectedStock, 
  stocks,
  searchQuery 
}: StockListProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    return `$${num.toFixed(2)}`;
  };

  const filteredStocks = useMemo(() => {
    if (!searchQuery) return stocks;
    const query = searchQuery.toLowerCase();
    return stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
    );
  }, [stocks, searchQuery]);

  const prevSearchQuery = useRef(searchQuery);
  useEffect(() => {
    prevSearchQuery.current = searchQuery;
  }, [searchQuery]);

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout" initial={false}>
        {filteredStocks.map((stock) => (
          <motion.div
            key={stock.symbol}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              opacity: { duration: 0.2 },
              y: { duration: 0.2 },
              layout: { duration: 0.2 }
            }}
            style={{ originY: 0 }}
          >
            <button
              onClick={() => onSelectStock(stock)}
              className={`w-full p-4 flex items-center justify-between
                bg-white rounded-lg border-2 transition-all duration-200
                hover:shadow-md hover:translate-y-[-2px]
                dark:bg-zinc-800/50 dark:text-white
                ${selectedStock?.symbol === stock.symbol
                  ? 'border-black dark:border-white shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'}`}
            >
              <div className="flex items-center gap-4">
                <motion.span
                  className="text-3xl"
                  initial={false}
                  animate={{
                    scale: selectedStock?.symbol === stock.symbol ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {stock.logo}
                </motion.span>
                <div className="text-left">
                  <div className="font-semibold text-lg text-zinc-900 dark:text-white">
                    <HighlightText text={stock.symbol} highlight={searchQuery} />
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-300">
                    <HighlightText text={stock.name} highlight={searchQuery} />
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 space-x-3">
                    <span>P/E: {stock.peRatio.toFixed(1)}x</span>
                    <span className="text-zinc-400 dark:text-zinc-500">•</span>
                    <span>FCF Yield: {(stock.fcfYield * 100).toFixed(1)}%</span>
                    <span className="text-zinc-400 dark:text-zinc-500">•</span>
                    <span>ROIC: {(stock.roic * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg text-zinc-900 dark:text-white">
                  ${stock.price.toFixed(2)}
                </div>
                <div className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.changePercent * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-2">
                  Market Cap: {formatNumber(stock.marketCap)}
                </div>
              </div>
            </button>
          </motion.div>
        ))}
        {filteredStocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8 text-zinc-500 dark:text-zinc-400"
          >
            No stocks found matching &ldquo;{searchQuery}&rdquo;
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => (
        regex.test(part) ? (
          <span key={i} className="bg-yellow-100 dark:bg-yellow-900/30">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      ))}
    </span>
  );
}