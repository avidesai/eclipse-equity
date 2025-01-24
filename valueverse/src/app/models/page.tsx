// src/app/models/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Stock } from '../types/stock';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import StockList from '../components/StockList';
import StockDetail from '../components/StockDetail';
import KeywordFilter from '../components/KeywordFilter';
import { getStockData } from '../utils/stockUtils';

export default function ModelsPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<{ text: string; emoji: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const data = await getStockData();
        setStocks(data);
        setSelectedStock(data[0] || null);
      } catch {
        setError('Failed to load stock data');
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSelectedKeyword(null);
    }
  };

  const handleKeywordSelect = (keyword: { text: string; emoji: string }) => {
    if (keyword.text === 'All') {
      setSelectedKeyword(null);
    } else {
      setSelectedKeyword(prevKeyword => 
        prevKeyword?.text === keyword.text ? null : keyword
      );
    }
  };

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const passesKeywordFilter = !selectedKeyword || 
        stock.keywords?.some(k => k.text === selectedKeyword.text);

      if (!passesKeywordFilter) return false;

      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
      );
    });
  }, [stocks, selectedKeyword, searchQuery]);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    if (window.innerWidth < 1024) {
      const detailSection = document.getElementById('stock-detail-section');
      if (detailSection) {
        const offset = 80;
        const elementPosition = detailSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12 flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
            <p className="text-center text-zinc-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
            <p className="text-center text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <SearchBar onSearch={handleSearch} />
              <KeywordFilter
                stocks={stocks}
                selectedKeyword={selectedKeyword}
                onKeywordSelect={handleKeywordSelect}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="h-[400px] lg:h-[calc(100vh-16rem)] lg:col-span-5 overflow-y-auto lg:pr-2 py-4 
                           scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 
                           scrollbar-track-transparent">
                <StockList
                  onSelectStock={handleStockSelect}
                  selectedStock={selectedStock}
                  stocks={filteredStocks}
                  searchQuery={searchQuery}
                />
              </div>

              <div id="stock-detail-section" 
                   className="lg:col-span-7 lg:h-[calc(100vh-16rem)] lg:overflow-y-auto lg:pl-2 py-4 
                            scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 
                            scrollbar-track-transparent">
                {selectedStock && <StockDetail stock={selectedStock} />}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}