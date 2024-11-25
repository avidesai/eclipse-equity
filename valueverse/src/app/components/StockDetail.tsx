// src/app/components/StockDetail.tsx
'use client';
import { Stock } from '../types/stock';
import PerformanceChart from './PerformanceChart';

interface MetricProps {
  label: string;
  value: number;
  isPercentage?: boolean;
  colorCode?: boolean;
  prefix?: string;
}

interface MetricSectionProps {
  title: string;
  children: React.ReactNode;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base font-semibold text-zinc-700 mb-5 text-center">
    {children}
  </h3>
);

export default function StockDetail({ stock }: { stock: Stock }) {
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

  const formatMetricValue = (value: number, isPercentage: boolean, prefix: string) => {
    if (prefix === 'x') return `${value.toFixed(1)}x`;
    if (prefix === '$') {
      const absValue = Math.abs(value);
      return value < 0 ? `-$${absValue.toFixed(2)}` : `$${value.toFixed(2)}`;
    }
    if (isPercentage) return formatPercentage(value);
    return formatNumber(value);
  };

  const Metric = ({ label, value, isPercentage = false, colorCode = false, prefix = '' }: MetricProps) => (
    <div className="text-center">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`font-medium ${
        colorCode && value !== 0 
          ? value > 0 
            ? 'text-green-500' 
            : 'text-red-500'
          : value < 0 ? 'text-red-500' : ''
      }`}>
        {formatMetricValue(value, isPercentage, prefix)}
      </p>
    </div>
  );

  const MetricSection = ({ title, children }: MetricSectionProps) => (
    <div className="mb-8">
      <SectionTitle>{title}</SectionTitle>
      <div className="grid grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">{stock.name}</h2>
            <p className="text-zinc-500">{stock.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">${stock.price.toFixed(2)}</p>
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
      <MetricSection title="Valuation">
        <Metric label="Intrinsic Value" value={stock.intrinsicValue} prefix="$" />
        <Metric label="Upside" value={stock.upside} isPercentage colorCode />
        <Metric label="FCF Yield" value={stock.fcfYield} isPercentage colorCode />
      </MetricSection>

      {/* Future Growth (5Y CAGR) */}
      <MetricSection title="Future Growth (5Y CAGR)">
        <Metric label="Revenue CAGR" value={stock.revenue.cagr} isPercentage colorCode />
        <Metric label="Net Income CAGR" value={stock.netIncome.cagr} isPercentage colorCode />
        <Metric label="FCF CAGR" value={stock.fcf.cagr} isPercentage colorCode />
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
              <tr className="text-zinc-500">
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
                    <tr key={metric.year} className="border-t border-zinc-100">
                      <td className="py-2">{metric.year}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={metric.revenue < 0 ? 'text-red-500' : ''}>
                            {formatNumber(metric.revenue)}
                          </span>
                          {prevYear && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              getGrowth(metric.revenue, prevYear.revenue)! >= 0 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {getGrowth(metric.revenue, prevYear.revenue)!.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={metric.netIncome < 0 ? 'text-red-500' : ''}>
                            {formatNumber(metric.netIncome)}
                          </span>
                          {prevYear && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              getGrowth(metric.netIncome, prevYear.netIncome)! >= 0 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {getGrowth(metric.netIncome, prevYear.netIncome)!.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={metric.fcf < 0 ? 'text-red-500' : ''}>
                            {formatNumber(metric.fcf)}
                          </span>
                          {prevYear && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              getGrowth(metric.fcf, prevYear.fcf)! >= 0 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
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

      <button className="w-full py-3 px-4 bg-black text-white rounded-lg 
                  hover:bg-zinc-800 transition-colors duration-200 font-bold">
        Download DCF Valuation Model
      </button>
    </div>
  );
}