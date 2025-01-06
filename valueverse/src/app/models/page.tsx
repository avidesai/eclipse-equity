// src/app/models/page.tsx

'use client';
import { useState, useEffect } from 'react';
import { Stock } from '../types/stock';
import Navigation from '../components/Navigation';
import SearchBar from '../components/SearchBar';
import StockList from '../components/StockList';
import StockDetail from '../components/StockDetail';
import { getStockData } from '../utils/stockUtils';

export default function ModelsPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const data = await getStockData();
        setStocks(data);
        setSelectedStock(data[0] || null); // Set the first stock as selected by default
      } catch {
        setError('Failed to load stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <main className="container mx-auto px-6 pt-24 pb-12">
        {loading ? (
          <p className="text-center text-zinc-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <SearchBar onSearch={setSearchQuery} />
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-2 py-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                <StockList
                  onSelectStock={setSelectedStock}
                  selectedStock={selectedStock}
                  stocks={stocks}
                  searchQuery={searchQuery}
                />
              </div>
              <div className="lg:h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pl-2 py-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {selectedStock && <StockDetail stock={selectedStock} />}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
