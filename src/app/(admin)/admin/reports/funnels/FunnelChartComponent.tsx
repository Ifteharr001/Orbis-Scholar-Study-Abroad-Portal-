"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface Props {
    data: {
        name: string;
        value: number;
        fill: string;
    }[]
}

const FunnelChartComponent = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical" 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis type="number" hide />
        <YAxis 
            dataKey="name" 
            type="category" 
            width={100} 
            tick={{ fontSize: 12 }}
        />
        <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Bar dataKey="value" barSize={40} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FunnelChartComponent;