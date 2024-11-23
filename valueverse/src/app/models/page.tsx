// src/app/models/page.tsx
'use client';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import SearchBar from '../components/SearchBar';
import StockList from '../components/StockList';
import StockDetail from '../components/StockDetail';

export default function ModelsPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <SearchBar />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StockList onSelectStock={setSelectedStock} />
          {selectedStock && <StockDetail stock={selectedStock} />}
        </div>
      </main>
    </div>
  );
}