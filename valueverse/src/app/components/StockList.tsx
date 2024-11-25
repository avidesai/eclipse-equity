// src/app/components/StockList.tsx
'use client';
import { Stock } from '../types/stock';
import { getStockData } from '../utils/stockUtils';

interface StockListProps {
  onSelectStock: (stock: Stock) => void;
  selectedStock: Stock | null;
}

export default function StockList({ onSelectStock, selectedStock }: StockListProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    return `$${num.toFixed(2)}`;
  };

  const stocks = getStockData();
  
  return (
    <div className="space-y-3">
      {stocks.map((stock) => (
        <button
          key={stock.symbol}
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
            <span className="text-3xl">{stock.logo}</span>
            <div className="text-left">
              <div className="font-semibold text-lg text-zinc-900 dark:text-white">
                {stock.symbol}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                {stock.name}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 space-x-3">
                <span>P/E: {stock.peRatio.toFixed(1)}x</span>
                <span className="text-zinc-400 dark:text-zinc-500">•</span>
                <span>FCF Yield: {stock.fcfYield.toFixed(1)}%</span>
                <span className="text-zinc-400 dark:text-zinc-500">•</span>
                <span>ROIC: {stock.roic.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg text-zinc-900 dark:text-white">
              ${stock.price.toFixed(2)}
            </div>
            <div className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.changePercent).toFixed(2)}%
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-2">
              Mkt Cap: {formatNumber(stock.marketCap)}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}