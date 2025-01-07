interface AlphaVantageQuote {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap?: number;
    volume: number;
}
declare class StockDataFetcher {
    private static instance;
    private lastRequestTime;
    private readonly minRequestInterval;
    private constructor();
    static getInstance(): StockDataFetcher;
    private enforceRateLimit;
    private fetchWithTimeout;
    fetchQuote(symbol: string): Promise<AlphaVantageQuote | null>;
    private calculateMetrics;
    updateStockData(stock: any): Promise<void>;
}
export default StockDataFetcher;
