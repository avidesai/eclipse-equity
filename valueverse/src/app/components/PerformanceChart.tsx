// src/app/components/PerformanceChart.tsx

'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { HistoricalMetric } from '../types/stock';

interface PerformanceChartProps {
  data: HistoricalMetric[];
}

// Define the type for tooltip payload
interface CustomTooltipPayload {
  value: number;
  dataKey: 'revenue' | 'netIncome' | 'fcf';
  fill: string;
  payload: HistoricalMetric;
}

// Define props type for custom tooltip
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const sortedData = [...data].sort((a, b) => a.year - b.year);
  
  const formatValue = (value: number) => {
    const absValue = Math.abs(value);
    let formattedValue;
    
    if (absValue >= 1e12) formattedValue = `${(absValue / 1e12).toFixed(1)}T`;
    else if (absValue >= 1e9) formattedValue = `${(absValue / 1e9).toFixed(1)}B`;
    else if (absValue >= 1e6) formattedValue = `${(absValue / 1e6).toFixed(0)}M`;
    else formattedValue = absValue.toString();
    
    return value < 0 ? `-${formattedValue}` : formattedValue;
  };

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 
                      rounded-lg p-3 shadow-sm">
          <p className="text-zinc-600 dark:text-zinc-300 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-sm ${
                entry.dataKey === 'revenue' ? 'bg-black dark:bg-zinc-300' :
                entry.dataKey === 'netIncome' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                {entry.dataKey === 'fcf' ? 'Free Cash Flow' : 
                 entry.dataKey === 'netIncome' ? 'Net Income' : 'Revenue'}:
              </span>
              <span className="text-zinc-900 dark:text-white font-medium">
                ${formatValue(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            barGap={0}
            barSize={20}
          >
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgb(113 113 122)', className: 'dark:fill-zinc-500' }}
              style={{ fontSize: '13px', fontWeight: 500 }}
            />
            <YAxis
              tickFormatter={formatValue}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgb(113 113 122)', className: 'dark:fill-zinc-500' }}
              style={{ fontSize: '13px', fontWeight: 500 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgb(244 244 245)', opacity: 0.5 }}
            />
            <Bar 
              dataKey="revenue" 
              fill="currentColor"
              className="text-black dark:text-zinc-300" 
              radius={[2, 2, 0, 0]} 
            />
            <Bar 
              dataKey="netIncome" 
              fill="currentColor"
              className="text-green-500" 
              radius={[2, 2, 0, 0]} 
            />
            <Bar 
              dataKey="fcf" 
              fill="currentColor"
              className="text-blue-500" 
              radius={[2, 2, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-6 mb-14 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black dark:bg-zinc-300 rounded-sm"/> 
          Revenue
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"/> 
          Net Income
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"/> 
          Free Cash Flow
        </div>
      </div>
    </div>
  );
}