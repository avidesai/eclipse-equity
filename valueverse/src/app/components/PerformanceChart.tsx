// src/app/components/PerformanceChart.tsx

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { HistoricalMetric } from '../types/stock';

interface PerformanceChartProps {
  data: HistoricalMetric[];
}

interface CustomTooltipPayload {
  value: number;
  dataKey: 'revenue' | 'netIncome' | 'fcf';
  fill: string;
  payload: HistoricalMetric;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const sortedData = [...data].sort((a, b) => a.year - b.year);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive calculations
  const isMobile = windowWidth < 640;
  const barSize = isMobile ? 16 : 20;
  const fontSize = isMobile ? 11 : 13;
  const margins = isMobile 
    ? { top: 5, right: 5, left: 0, bottom: 5 }
    : { top: 5, right: 20, left: 10, bottom: 5 };
  
  const formatValue = (value: number) => {
    const absValue = Math.abs(value);
    let formattedValue;
    
    if (absValue >= 1e12) formattedValue = `${(absValue / 1e12).toFixed(1)}T`;
    else if (absValue >= 1e9) formattedValue = `${(absValue / 1e9).toFixed(1)}B`;
    else if (absValue >= 1e6) formattedValue = `${(absValue / 1e6).toFixed(0)}M`;
    else formattedValue = absValue.toString();
    
    return value < 0 ? `-$${formattedValue}` : `$${formattedValue}`;
  };

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 
                      rounded-lg p-3 sm:p-3 shadow-sm">
          <p className="text-zinc-600 dark:text-zinc-300 font-medium mb-2 text-xs sm:text-sm">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-sm ${
                entry.dataKey === 'revenue' ? 'bg-black dark:bg-zinc-300' :
                entry.dataKey === 'netIncome' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <span className="text-zinc-600 dark:text-zinc-400 capitalize text-xs sm:text-sm">
                {entry.dataKey === 'fcf' ? 'Free Cash Flow' : 
                 entry.dataKey === 'netIncome' ? 'Net Income' : 'Revenue'}:
              </span>
              <span className="text-zinc-900 dark:text-white font-medium text-xs sm:text-sm">
                {formatValue(entry.value)}
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
      <div className="h-52 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={margins}
            barGap={0}
            barSize={barSize}
          >
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ 
                fill: 'rgb(113 113 122)', 
                className: 'dark:fill-zinc-500',
                fontSize,
                fontWeight: 500 
              }}
            />
            <YAxis
              tickFormatter={formatValue}
              tickLine={false}
              axisLine={false}
              tick={{ 
                fill: 'rgb(113 113 122)', 
                className: 'dark:fill-zinc-500',
                fontSize,
                fontWeight: 500 
              }}
              width={isMobile ? 60 : 70}
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
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 mb-8 sm:mb-14 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-black dark:bg-zinc-300 rounded-sm"/> 
          Revenue
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-sm"/> 
          Net Income
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"/> 
          Free Cash Flow
        </div>
      </div>
    </div>
  );
}