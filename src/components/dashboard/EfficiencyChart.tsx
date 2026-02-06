import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FinancialData } from '@/types/financial';
import { formatPercent, getTickerLabel } from '@/lib/formatters';
import { useMemo } from 'react';

interface EfficiencyChartProps {
  data: FinancialData[];
}

export const EfficiencyChart = ({ data }: EfficiencyChartProps) => {
  const chartData = useMemo(() => {
    const tickerGroups = new Map<string, { roic: number[]; margem: number[] }>();
    
    data.forEach(d => {
      if (d.roic !== null || d.margem_ebitda !== null) {
        if (!tickerGroups.has(d.ticker)) {
          tickerGroups.set(d.ticker, { roic: [], margem: [] });
        }
        const group = tickerGroups.get(d.ticker)!;
        if (d.roic !== null && d.roic > -50 && d.roic < 50) group.roic.push(d.roic);
        if (d.margem_ebitda !== null && d.margem_ebitda > -100 && d.margem_ebitda < 200) {
          group.margem.push(d.margem_ebitda);
        }
      }
    });

    return [...tickerGroups.entries()].map(([ticker, values]) => ({
      ticker,
      name: getTickerLabel(ticker),
      roic: values.roic.length > 0 
        ? values.roic.reduce((a, b) => a + b, 0) / values.roic.length 
        : 0,
      margemEbitda: values.margem.length > 0
        ? values.margem.reduce((a, b) => a + b, 0) / values.margem.length
        : 0,
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{formatPercent(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container h-[300px]">
      <h3 className="text-sm font-semibold mb-4">Análise de Eficiência (Médias)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis
            tickFormatter={(v) => `${v.toFixed(0)}%`}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar
            dataKey="roic"
            name="ROIC (%)"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="margemEbitda"
            name="Margem EBITDA (%)"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
