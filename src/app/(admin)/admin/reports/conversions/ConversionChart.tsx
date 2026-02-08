"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface Props {
  data: {
    name: string;
    Applications: number;
    Enrolled: number;
    Rate: number | string;
  }[];
}

const ConversionChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            dy={10}
        />
        <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
        />
        <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Legend verticalAlign="top" height={36} iconType="circle" />
        
        <Area 
            type="monotone" 
            dataKey="Applications" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorApps)" 
            strokeWidth={2}
        />
        
        <Area 
            type="monotone" 
            dataKey="Enrolled" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorEnrolled)" 
            strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ConversionChart;