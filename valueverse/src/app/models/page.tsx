// src/app/models/page.tsx
'use client';
import { useState } from 'react';
import { Stock } from '../types/stock';
import Navigation from '../components/Navigation';
import SearchBar from '../components/SearchBar';
import StockList from '../components/StockList';
import StockDetail from '../components/StockDetail';

export default function ModelsPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <main className="container mx-auto px-6 pt-24 pb-12">
        <SearchBar />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-2 py-4
                         scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700
                         scrollbar-track-transparent">
            <StockList onSelectStock={setSelectedStock} selectedStock={selectedStock} />
          </div>
          <div className="lg:h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pl-2 py-4
                         scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700
                         scrollbar-track-transparent">
            {selectedStock && <StockDetail stock={selectedStock} />}
          </div>
        </div>
      </main>
    </div>
  );
}