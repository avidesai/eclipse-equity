// src/app/utils/stockUtils.ts

import { Stock } from '../types/stock';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const getStockData = async (): Promise<Stock[]> => {
  const response = await fetch(`${API_BASE_URL}/stocks`);
  if (!response.ok) {
    throw new Error('Failed to fetch stock data');
  }
  return await response.json();
};

export const getStockBySymbol = async (symbol: string): Promise<Stock | undefined> => {
  const response = await fetch(`${API_BASE_URL}/stocks/static/${symbol}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock data for symbol: ${symbol}`);
  }
  return await response.json();
};
