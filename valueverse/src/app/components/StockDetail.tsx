// src/app/components/StockDetail.tsx
'use client';
import { Stock } from '../types/stock';
import PerformanceChart from './PerformanceChart';
import { useAuth } from '../contexts/AuthContext';
import PremiumButton from './PremiumButton';
import DownloadDCFButton from './DownloadDCFButton';

interface MetricProps {
  label: string;
  value: number;
  isPercentage?: boolean;
  colorCode?: boolean;
  prefix?: string;
  mobileLabel?: string;
}

interface MetricSectionProps {
  title: string;
  children: React.ReactNode;
  isPremiumContent?: boolean;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200 mb-5 text-center">
    {children}
  </h3>
);

export default function StockDetail({ stock }: { stock: Stock }) {
  const { isAuthenticated, user } = useAuth();
  const hasPremiumAccess = isAuthenticated && user?.isPremium;

  const formatNumber = (num: number) => {
    const absNum = Math.abs(num);
    let formattedNum;
    if (absNum >= 1e12) formattedNum = `${(absNum / 1e12).toFixed(2)}T`;
    else if (absNum >= 1e9) formattedNum = `${(absNum / 1e9).toFixed(2)}B`;
    else if (absNum >= 1e6) formattedNum = `${(absNum / 1e6).toFixed(0)}M`;
    else formattedNum = absNum.toFixed(2);
    
    return num < 0 ? `-$${formattedNum}` : `$${formattedNum}`;
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const formatMetricValue = (value: number, isPercentage: boolean, prefix: string) => {
    if (prefix === 'x') return `${value.toFixed(1)}x`;
    if (prefix === '$') {
      const absValue = Math.abs(value);
      return value < 0 ? `-$${absValue.toFixed(2)}` : `$${value.toFixed(2)}`;
    }
    if (isPercentage) return formatPercentage(value);
    return formatNumber(value);
  };

  const Metric = ({ label, value, isPercentage = false, colorCode = false, prefix = '', mobileLabel }: MetricProps) => (
    <div className="text-center">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{mobileLabel || label}</span>
      </p>
      <p className={`font-medium ${
        colorCode && value !== 0 
          ? value > 0 
            ? 'text-green-500 dark:text-green-400' 
            : 'text-red-500 dark:text-red-400'
          : value < 0 
            ? 'text-red-500 dark:text-red-400' 
            : 'text-zinc-900 dark:text-white'
      }`}>
        {formatMetricValue(value, isPercentage, prefix)}
      </p>
    </div>
  );

  const MetricSection = ({ title, children, isPremiumContent = false }: MetricSectionProps) => {
    const shouldBlur = isPremiumContent && !hasPremiumAccess;
  
    return (
      <div className="mb-6 sm:mb-8">
        <SectionTitle>{title}</SectionTitle>
        <div className="relative">
          <div className={`grid grid-cols-3 gap-2 sm:gap-4 ${shouldBlur ? 'filter blur-sm select-none' : ''}`}>
            {children}
          </div>
          {shouldBlur && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm rounded-lg">
              <PremiumButton />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-800/50 rounded-lg border-2 border-zinc-200 
                    dark:border-zinc-700 p-6 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between">
        <div className="flex items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
              {stock.name}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base">
              {stock.symbol}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            ${stock.price.toFixed(2)}
          </p>
          <div className={`text-sm sm:text-base ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stock.change >= 0 ? '↑' : '↓'} ${Math.abs(stock.change).toFixed(2)} (
            {Math.abs(stock.changePercent * 100).toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div>
        <PerformanceChart data={stock.historicalMetrics} />
      </div>

      {/* Download DCF Button */}
      <div className="pt-0 sm:pt-2">
        <DownloadDCFButton symbol={stock.symbol} />
      </div>

      {/* Key Metrics */}
      <MetricSection title="Key Metrics">
        <Metric label="Market Cap" value={stock.marketCap} />
        <Metric label="P/E" value={stock.peRatio} prefix="x" />
        <Metric label="FCF Yield" value={stock.fcfYield * 100} isPercentage colorCode />
      </MetricSection>

      {/* Valuation - Premium Section */}
      <MetricSection title="Intrinsic Value" isPremiumContent>
        <Metric label="Intrinsic Value" value={stock.intrinsicValue} prefix="$" />
        <Metric label="Upside / Downside" value={stock.upside * 100} isPercentage colorCode />
        <Metric label="ROIC" value={stock.roic * 100} isPercentage colorCode />
      </MetricSection>

      {/* Future Growth - Premium Section */}
      <MetricSection title="Future Growth (5Y CAGR)" isPremiumContent>
        <Metric label="Revenue CAGR" value={stock.revenue.cagr * 100} isPercentage colorCode />
        <Metric label="Net Income CAGR" value={stock.netIncome.cagr * 100} isPercentage colorCode />
        <Metric label="FCF CAGR" value={stock.fcf.cagr * 100} isPercentage colorCode />
      </MetricSection>

      {/* Margins */}
      <MetricSection title="Margins">
        <Metric label="Gross Margin" value={stock.grossMargin * 100} isPercentage />
        <Metric label="Net Income Margin" mobileLabel="Net Margin" value={stock.netMargin * 100} isPercentage />
        <Metric label="FCF Margin" value={stock.fcfMargin * 100} isPercentage />
      </MetricSection>

      {/* Balance Sheet */}
      <MetricSection title="Balance Sheet">
        <Metric label="Cash & Securities" mobileLabel="Cash" value={stock.cash} />
        <Metric label="Total Debt" value={stock.debt} />
        <Metric label="Net Cash" value={stock.netCash} colorCode />
      </MetricSection>

      {/* Historical Performance */}
      <div>
        <SectionTitle>Historical Growth</SectionTitle>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-base">
            <thead>
              <tr className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base">
                <th className="text-left pb-2 pl-4 sm:pl-0">Year</th>
                <th className="text-right pb-2">Revenue</th>
                <th className="text-right pb-2">Net Income</th>
                <th className="text-right pb-2 pr-4 sm:pr-0">
                  <span className="hidden sm:inline">Free Cash Flow</span>
                  <span className="sm:hidden">FCF</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...stock.historicalMetrics]
                .sort((a, b) => a.year - b.year)
                .slice(1)
                .map((metric) => {
                  const allData = [...stock.historicalMetrics].sort((a, b) => a.year - b.year);
                  const currentYearIndex = allData.findIndex(m => m.year === metric.year);
                  const prevYear = currentYearIndex > 0 ? allData[currentYearIndex - 1] : null;

                  const getGrowth = (current: number, previous: number) => 
                    previous ? ((current - previous) / previous) * 100 : null;

                  return (
                    <tr key={metric.year} className="border-t border-zinc-200 dark:border-zinc-700">
                      <td className="py-2 text-zinc-900 dark:text-white pl-4 sm:pl-0 text-sm sm:text-base">
                        {metric.year}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <span className="hidden sm:inline text-sm sm:text-base">
                            {formatNumber(metric.revenue)}
                          </span>
                          {prevYear && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
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
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <span className="hidden sm:inline text-sm sm:text-base">
                            {formatNumber(metric.netIncome)}
                          </span>
                          {prevYear && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                              getGrowth(metric.netIncome, prevYear.netIncome)! >= 0 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {getGrowth(metric.netIncome, prevYear.netIncome)!.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-right pr-4 sm:pr-0">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <span className="hidden sm:inline text-sm sm:text-base">
                            {formatNumber(metric.fcf)}
                          </span>
                          {prevYear && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
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

      {/* Future Performance */}
      <div className="mb-6 sm:mb-8">
        <SectionTitle>Future Growth (Estimates)</SectionTitle>
        <div className="relative">
          <div className={`${!hasPremiumAccess ? 'filter blur-sm select-none' : ''}`}>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-base">
                <thead>
                  <tr className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base">
                    <th className="text-left pb-2 pl-4 sm:pl-0">Year</th>
                    <th className="text-right pb-2">Revenue</th>
                    <th className="text-right pb-2">Net Income</th>
                    <th className="text-right pb-2 pr-4 sm:pr-0">
                      <span className="hidden sm:inline">Free Cash Flow</span>
                      <span className="sm:hidden">FCF</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...stock.futureMetrics]
                    .sort((a, b) => a.year - b.year)
                    .map((metric, index) => {
                      const allFutureData = [...stock.futureMetrics].sort((a, b) => a.year - b.year);
                      const currentYearIndex = allFutureData.findIndex(m => m.year === metric.year);
                      const prevFutureYear = currentYearIndex > 0 ? allFutureData[currentYearIndex - 1] : null;

                      const lastHistoricalYear = [...stock.historicalMetrics]
                        .sort((a, b) => a.year - b.year)
                        .slice(-1)[0];

                      const getGrowth = (current: number, previous: number) => 
                        previous ? ((current - previous) / previous) * 100 : null;

                      const getPreviousMetrics = () => {
                        if (index === 0 && lastHistoricalYear) {
                          return {
                            revenue: lastHistoricalYear.revenue,
                            netIncome: lastHistoricalYear.netIncome,
                            fcf: lastHistoricalYear.fcf
                          };
                        }
                        return prevFutureYear;
                      };

                      const previousMetrics = getPreviousMetrics();

                      return (
                        <tr key={metric.year} className="border-t border-zinc-200 dark:border-zinc-700">
                          <td className="py-2 text-zinc-900 dark:text-white pl-4 sm:pl-0 text-sm sm:text-base">
                            {metric.year}
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <span className="hidden sm:inline text-sm sm:text-base">
                                {formatNumber(metric.revenue)}
                              </span>
                              {previousMetrics && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                                  getGrowth(metric.revenue, previousMetrics.revenue)! >= 0 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {getGrowth(metric.revenue, previousMetrics.revenue)!.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <span className="hidden sm:inline text-sm sm:text-base">
                                {formatNumber(metric.netIncome)}
                              </span>
                              {previousMetrics && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                                  getGrowth(metric.netIncome, previousMetrics.netIncome)! >= 0 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {getGrowth(metric.netIncome, previousMetrics.netIncome)!.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-right pr-4 sm:pr-0">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <span className="hidden sm:inline text-sm sm:text-base">
                                {formatNumber(metric.fcf)}
                              </span>
                              {previousMetrics && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                                  getGrowth(metric.fcf, previousMetrics.fcf)! >= 0 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {getGrowth(metric.fcf, previousMetrics.fcf)!.toFixed(1)}%
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
          {!hasPremiumAccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm rounded-lg">
              <PremiumButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}