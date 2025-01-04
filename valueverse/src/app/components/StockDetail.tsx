// src/app/components/StockDetail.tsx
'use client';
import { Stock } from '../types/stock';
import PerformanceChart from './PerformanceChart';
import PremiumButton from './PremiumButton';
import { useAuth } from '../contexts/AuthContext';

interface MetricProps {
  label: string;
  value: number;
  isPercentage?: boolean;
  colorCode?: boolean;
  prefix?: string;
  isBlurred?: boolean;
}

interface MetricSectionProps {
  title: string;
  children: React.ReactNode;
  isBlurred?: boolean;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-200 mb-5 text-center">
    {children}
  </h3>
);

export default function StockDetail({ stock }: { stock: Stock }) {
  const { user } = useAuth();
  const isPremium = user?.isPremium;

  const formatNumber = (num: number) => {
    const absNum = Math.abs(num);
    let formattedNum;
    if (absNum >= 1e12) formattedNum = `${(absNum / 1e12).toFixed(2)}T`;
    else if (absNum >= 1e9) formattedNum = `${(absNum / 1e9).toFixed(2)}B`;
    else if (absNum >= 1e6) formattedNum = `${(absNum / 1e6).toFixed(2)}M`;
    else formattedNum = absNum.toFixed(2);
    
    return num < 0 ? `-$${formattedNum}` : `$${formattedNum}`;
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const Metric = ({ label, value, isPercentage = false, colorCode = false, prefix = '', isBlurred = false }: MetricProps) => (
    <div className="text-center relative">
      {isBlurred && (
        <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center z-10">
          <PremiumButton />
        </div>
      )}
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
      <p className={`font-medium ${
        colorCode && value !== 0 
          ? value > 0 
            ? 'text-green-500 dark:text-green-400' 
            : 'text-red-500 dark:text-red-400'
          : value < 0 
            ? 'text-red-500 dark:text-red-400' 
            : 'text-zinc-900 dark:text-white'
      } ${isBlurred ? 'blur-sm' : ''}`}>
        {isPercentage ? formatPercentage(value) : formatNumber(value)}
      </p>
    </div>
  );

  const MetricSection = ({ title, children, isBlurred = false }: MetricSectionProps) => (
    <div className="mb-8 relative">
      {isBlurred && (
        <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center z-10">
          <PremiumButton />
        </div>
      )}
      <SectionTitle>{title}</SectionTitle>
      <div className="grid grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-zinc-800/50 rounded-lg border-2 border-zinc-200 
                    dark:border-zinc-700 p-6 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {stock.name}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300">{stock.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            ${stock.price.toFixed(2)}
          </p>
          <div className={stock.change >= 0 ? 'text-green-500' : 'text-red-500'}>
            {stock.change >= 0 ? '↑' : '↓'} ${Math.abs(stock.change).toFixed(2)} (
            {Math.abs(stock.changePercent).toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div>
        <PerformanceChart data={stock.historicalMetrics} />
      </div>

      {/* Key Metrics */}
      <MetricSection title="Key Metrics">
        <Metric label="Market Cap" value={stock.marketCap} />
        <Metric label="P/E" value={stock.peRatio} prefix="x" />
        <Metric label="ROIC" value={stock.roic} isPercentage colorCode />
      </MetricSection>

      {/* Valuation */}
      <MetricSection title="Valuation" isBlurred={!isPremium}>
        <Metric label="Intrinsic Value" value={stock.intrinsicValue} prefix="$" isBlurred={!isPremium} />
        <Metric label="Upside / Downside" value={stock.upside} isPercentage colorCode isBlurred={!isPremium} />
        <Metric label="FCF Yield" value={stock.fcfYield} isPercentage colorCode isBlurred={!isPremium} />
      </MetricSection>

      {/* Future Growth */}
      <MetricSection title="Future Growth (5Y CAGR)" isBlurred={!isPremium}>
        <Metric label="Revenue CAGR" value={stock.revenue.cagr} isPercentage colorCode isBlurred={!isPremium} />
        <Metric label="Net Income CAGR" value={stock.netIncome.cagr} isPercentage colorCode isBlurred={!isPremium} />
        <Metric label="FCF CAGR" value={stock.fcf.cagr} isPercentage colorCode isBlurred={!isPremium} />
      </MetricSection>

      {/* Margins */}
      <MetricSection title="Margins">
        <Metric label="Gross Margin" value={stock.grossMargin} isPercentage />
        <Metric label="Net Income Margin" value={stock.netMargin} isPercentage />
        <Metric label="FCF Margin" value={stock.fcfMargin} isPercentage />
      </MetricSection>

      {/* Balance Sheet */}
      <MetricSection title="Balance Sheet">
        <Metric label="Cash" value={stock.cash} />
        <Metric label="Total Debt" value={stock.debt} />
        <Metric label="Net Cash" value={stock.netCash} colorCode />
      </MetricSection>

      {/* Historical Performance */}
      <div>
        <SectionTitle>Historical Performance</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-600 dark:text-zinc-300">
                <th className="text-left pb-2">Year</th>
                <th className="text-right pb-2">Revenue</th>
                <th className="text-right pb-2">Net Income</th>
                <th className="text-right pb-2">Free Cash Flow</th>
              </tr>
            </thead>
            <tbody>
              {[...stock.historicalMetrics]
                .sort((a, b) => b.year - a.year)
                .slice(0, -1)
                .map((metric) => {
                  const allData = [...stock.historicalMetrics].sort((a, b) => b.year - a.year);
                  const currentYearIndex = allData.findIndex(m => m.year === metric.year);
                  const prevYear = allData[currentYearIndex + 1];

                  const getGrowth = (current: number, previous: number) => 
                    previous ? ((current - previous) / previous) * 100 : null;

                  return (
                    <tr key={metric.year} className="border-t border-zinc-200 dark:border-zinc-700">
                      <td className="py-2 text-zinc-900 dark:text-white">{metric.year}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`${metric.revenue < 0 
                            ? 'text-red-500 dark:text-red-400' 
                            : 'text-zinc-900 dark:text-white'}`}>
                            {formatNumber(metric.revenue)}
                          </span>
                          {prevYear && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              getGrowth(metric.revenue, prevYear.revenue)! >= 0 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {getGrowth(metric.revenue, prevYear.revenue)!.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`${metric.netIncome < 0 
                            ? 'text-red-500 dark:text-red-400' 
                            : 'text-zinc-900 dark:text-white'}`}>
                            {formatNumber(metric.netIncome)}
                          </span>
                          {prevYear && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              getGrowth(metric.netIncome, prevYear.netIncome)! >= 0 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {getGrowth(metric.netIncome, prevYear.netIncome)!.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`${metric.fcf < 0 
                            ? 'text-red-500 dark:text-red-400' 
                            : 'text-zinc-900 dark:text-white'}`}>
                            {formatNumber(metric.fcf)}
                          </span>
                          {prevYear && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              getGrowth(metric.fcf, prevYear.fcf)! >= 0 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {getGrowth(metric.fcf, prevYear.fcf)!.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <button className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black 
                        rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 
                        transition-all duration-200 font-bold
                        hover:translate-y-[-2px] active:translate-y-0">
        Download DCF Valuation Model
      </button>
    </div>
  );
}
