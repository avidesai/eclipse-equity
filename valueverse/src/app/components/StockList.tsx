// src/app/components/StockList.tsx
'use client';
import { Stock } from '../types/stock';
import { getStockData } from '../utils/stockUtils';

interface StockListProps {
  onSelectStock: (stock: Stock) => void;
}

export default function StockList({ onSelectStock }: StockListProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    return `$${num.toFixed(2)}`;
  };

  const stocks = getStockData();

  return (
    <div className="space-y-2">
      {stocks.map((stock) => (
        <button
          key={stock.symbol}
          onClick={() => onSelectStock(stock)}
          className="w-full p-4 flex items-center justify-between bg-white
                   rounded-lg border border-zinc-200 hover:border-black/20
                   transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{stock.logo}</span>
            <div className="text-left">
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-zinc-500">{stock.name}</div>
              <div className="text-xs text-zinc-400 mt-1 space-x-2">
                <span>P/E: {stock.peRatio.toFixed(1)}x</span>
                <span>|</span>
                <span>FCF Yield: {stock.fcfYield.toFixed(1)}%</span>
                <span>|</span>
                <span>ROIC: {stock.roic.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">${stock.price.toFixed(2)}</div>
            <div className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.changePercent).toFixed(2)}%
            </div>
            <div className="text-xs text-zinc-400">
              Mkt Cap: {formatNumber(stock.marketCap)}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}