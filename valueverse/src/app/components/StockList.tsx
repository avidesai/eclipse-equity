// src/app/components/StockList.tsx
'use client';
import { Stock } from '../types/stock';

interface StockListProps {
  onSelectStock: (stock: Stock) => void;
}

export default function StockList({ onSelectStock }: StockListProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    return `$${num.toFixed(2)}`;
  };

  // Sample data based on your DCF model
  const stocks: Stock[] = [
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      price: 164.76,
      change: -1.71,
      changePercent: -1.71,
      logo: '🔍',
      marketCap: 2060869000000,
      enterpriseValue: 1917219000000,
      roic: 23.2,
      revenue: {
        current: 307400000000,
        growth: 9,
        cagr: 11
      },
      netIncome: {
        current: 73795000000,
        growth: 23,
        cagr: 16
      },
      fcf: {
        current: 56241000000,
        growth: 18,
        cagr: 26
      },
      grossMargin: 57,
      netMargin: 27,
      fcfMargin: 24,
      psRatio: 6,
      peRatio: 22,
      fcfYield: 4.0,
      cash: 110900000000,
      debt: 29867000000,
      netCash: 81033000000,
      terminalValue: 2372533000000,
      intrinsicValue: 187,
      upside: 14,
      historicalMetrics: [
        {
          year: 2020,
          revenue: 182500000000,
          netIncome: 40269000000,
          fcf: 31872000000,
          shares: 13529
        },
        {
          year: 2021,
          revenue: 257600000000,
          netIncome: 76032000000,
          fcf: 49560000000,
          shares: 13275
        },
        {
          year: 2022,
          revenue: 282800000000,
          netIncome: 59972000000,
          fcf: 47640000000,
          shares: 12943
        },
        {
          year: 2023,
          revenue: 307400000000,
          netIncome: 73795000000,
          fcf: 56241000000,
          shares: 12516
        }
      ]
    }
    // Add more stocks as needed
  ];

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