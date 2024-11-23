// src/app/utils/stockUtils.ts
import { Stock } from '../types/stock';
import GOOGL from '../stockdata/GOOGL.json';
// Import other stock data files as needed

export const getStockData = (): Stock[] => {
  return [
    GOOGL as Stock,  // Add type assertion here
    // Add other stocks as they're added
  ];
};

export const getStockBySymbol = (symbol: string): Stock | undefined => {
  const stocks = getStockData();
  return stocks.find(stock => stock.symbol === symbol);
};