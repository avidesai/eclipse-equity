// src/app/utils/stockUtils.ts
import { Stock } from '../types/stock';
import GOOGL from '../stockdata/GOOGL.json';
import NVDA from '../stockdata/NVDA.json';
import ABNB from '../stockdata/ABNB.json';
import MA from '../stockdata/MA.json';
import AMZN from '../stockdata/AMZN.json';
import ASML from '../stockdata/ASML.json';
import CMG from '../stockdata/CMG.json';
import LLY from '../stockdata/LLY.json';
import MELI from '../stockdata/MELI.json';
import SPGI from '../stockdata/SPGI.json';
import TSLA from '../stockdata/TSLA.json';
import TSM from '../stockdata/TSM.json';
import MC from '../stockdata/MC.json';

export const getStockData = (): Stock[] => {
  return [
    GOOGL as Stock,
    NVDA as Stock,
    ABNB as Stock,
    MA as Stock,
    AMZN as Stock,
    ASML as Stock,
    CMG as Stock,
    LLY as Stock,
    MELI as Stock,
    SPGI as Stock,
    TSLA as Stock,
    TSM as Stock,
    MC as Stock
  ];
};

export const getStockBySymbol = (symbol: string): Stock | undefined => {
  const stocks = getStockData();
  return stocks.find(stock => stock.symbol === symbol);
};