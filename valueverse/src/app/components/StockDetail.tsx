// src/app/components/StockDetail.tsx
'use client';
import { Stock } from '../types/stock';

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

export default function StockDetail({ stock }: { stock: Stock }) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const Metric = ({ label, value, isPercentage = false, colorCode = false, prefix = '' }: MetricProps) => (
    <div>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`font-medium ${
        colorCode && value !== 0 
          ? value > 0 
            ? 'text-green-500' 
            : 'text-red-500'
          : ''
      }`}>
        {prefix}{isPercentage ? formatPercentage(value) : formatNumber(value)}
      </p>
    </div>
  );

  const MetricSection = ({ title, children }: MetricSectionProps) => (
    <div>
      <h3 className="text-sm font-medium text-zinc-500 mb-3">{title}</h3>
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
          <span className="text-4xl">{stock.logo}</span>
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

      {/* Key Metrics */}
      <MetricSection title="Key Metrics">
        <Metric label="Market Cap" value={stock.marketCap} />
        <Metric label="P/E" value={stock.peRatio} prefix="" />
        <Metric label="ROIC" value={stock.roic} isPercentage colorCode />
      </MetricSection>

      {/* DCF Analysis */}
      <MetricSection title="Valuation">
        <Metric label="Intrinsic Value" value={stock.intrinsicValue} prefix="" />
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
        <h3 className="text-sm font-medium text-zinc-500 mb-3">Historical Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500">
                <th className="text-left pb-2">Year</th>
                <th className="text-right pb-2">Revenue</th>
                <th className="text-right pb-2">Net Income</th>
                <th className="text-right pb-2">FCF</th>
                <th className="text-right pb-2">Shares</th>
              </tr>
            </thead>
            <tbody>
              {stock.historicalMetrics.map((metric) => (
                <tr key={metric.year} className="border-t border-zinc-100">
                  <td className="py-2">{metric.year}</td>
                  <td className="text-right">{formatNumber(metric.revenue)}</td>
                  <td className="text-right">{formatNumber(metric.netIncome)}</td>
                  <td className="text-right">{formatNumber(metric.fcf)}</td>
                  <td className="text-right">{metric.shares.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button className="w-full py-3 px-4 bg-black text-white rounded-lg 
                       hover:bg-zinc-800 transition-colors duration-200">
        View Full DCF Model
      </button>
    </div>
  );
}