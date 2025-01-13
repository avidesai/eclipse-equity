// src/app/models/page.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Stock } from '../types/stock';
import Navigation from '../components/Navigation';
import SearchBar from '../components/SearchBar';
import StockList from '../components/StockList';
import StockDetail from '../components/StockDetail';
import KeywordFilter from '../components/KeywordFilter';
import { getStockData } from '../utils/stockUtils';

export default function ModelsPage() {
  // State management
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<Array<{ text: string; emoji: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stock data on component mount
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

  // Handle keyword selection/deselection
  const handleKeywordSelect = (keyword: { text: string; emoji: string }) => {
    setSelectedKeywords(prev => {
      const exists = prev.some(k => k.text === keyword.text);
      if (exists) {
        return prev.filter(k => k.text !== keyword.text);
      }
      return [...prev, keyword];
    });
  };

  // Filter stocks based on keywords and search query
  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      // First apply keyword filters
      const passesKeywordFilter = selectedKeywords.length === 0 || 
        selectedKeywords.every(keyword => 
          stock.keywords?.some(k => k.text === keyword.text)
        );

      if (!passesKeywordFilter) return false;

      // Then apply search query
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
      );
    });
  }, [stocks, selectedKeywords, searchQuery]);

  // Handle stock selection and scroll on mobile
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
        {loading ? (
          <p className="text-center text-zinc-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Search and Filter Section */}
            <div className="space-y-6">
              <SearchBar onSearch={setSearchQuery} />
              <KeywordFilter
                stocks={stocks}
                selectedKeywords={selectedKeywords}
                onKeywordSelect={handleKeywordSelect}
              />
            </div>

            {/* Main Content Grid */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Stock List */}
              <div className="h-[400px] lg:h-[calc(100vh-12rem)] lg:col-span-5 overflow-y-auto lg:pr-2 py-4 
                           scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 
                           scrollbar-track-transparent">
                <StockList
                  onSelectStock={handleStockSelect}
                  selectedStock={selectedStock}
                  stocks={filteredStocks}
                  searchQuery={searchQuery}
                />
              </div>

              {/* Stock Details */}
              <div id="stock-detail-section" 
                   className="lg:col-span-7 lg:h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pl-2 py-4 
                            scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 
                            scrollbar-track-transparent">
                {selectedStock && <StockDetail stock={selectedStock} />}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}