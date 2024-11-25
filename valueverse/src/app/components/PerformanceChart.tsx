import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalMetric } from '../types/stock';

interface PerformanceChartProps {
  data: HistoricalMetric[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  const formatValue = (value: number) => {
    const absValue = Math.abs(value);
    let formattedValue;
    
    if (absValue >= 1e12) formattedValue = `${(absValue / 1e12).toFixed(1)}T`;
    else if (absValue >= 1e9) formattedValue = `${(absValue / 1e9).toFixed(1)}B`;
    else if (absValue >= 1e6) formattedValue = `${(absValue / 1e6).toFixed(1)}M`;
    else formattedValue = absValue.toString();
    
    return value < 0 ? `-${formattedValue}` : formattedValue;
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
              style={{ fontSize: '12px' }}
            />
            <YAxis
              tickFormatter={formatValue}
              tickLine={false}
              axisLine={false}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              formatter={(value: number) => [`$${formatValue(value)}`]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="revenue" fill="#000000" radius={[2, 2, 0, 0]} />
            <Bar dataKey="netIncome" fill="#22c55e" radius={[2, 2, 0, 0]} />
            <Bar dataKey="fcf" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-6 mb-14 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded-sm"/> Revenue
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"/> Net Income
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"/> Free Cash Flow
        </div>
      </div>
    </div>
  );
}