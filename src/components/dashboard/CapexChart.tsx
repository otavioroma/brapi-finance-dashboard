import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FinancialData } from '@/types/financial';
import { formatPercent, getTickerLabel, getTickerColor } from '@/lib/formatters';
import { useMemo } from 'react';

interface CapexChartProps {
  data: FinancialData[];
  selectedTickers: string[];
}

export const CapexChart = ({ data, selectedTickers }: CapexChartProps) => {
  const chartData = useMemo(() => {
    const periodMap = new Map<string, Record<string, string | number | null>>();
    
    data.forEach(d => {
      if (!periodMap.has(d.periodo)) {
        periodMap.set(d.periodo, { periodo: d.periodo });
      }
      const entry = periodMap.get(d.periodo)!;
      // Limit capex_receita to reasonable values for visualization
      const capexReceita = d.capex_receita !== null && d.capex_receita < 100 
        ? d.capex_receita 
        : null;
      entry[d.ticker] = capexReceita;
    });

    const periods = [...periodMap.keys()].sort((a, b) => {
      const [qA, yA] = a.match(/(\d)T(\d{4})/)?.slice(1) || [];
      const [qB, yB] = b.match(/(\d)T(\d{4})/)?.slice(1) || [];
      if (yA !== yB) return parseInt(yA) - parseInt(yB);
      return parseInt(qA) - parseInt(qB);
    });

    return periods.map(p => periodMap.get(p)!);
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
              <span className="text-muted-foreground">{getTickerLabel(entry.dataKey)}:</span>
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
      <h3 className="text-sm font-semibold mb-4">Investimento em Infraestrutura (Capex/Receita %)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="periodo"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis
            tickFormatter={(v) => `${v.toFixed(0)}%`}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value) => getTickerLabel(value)}
          />
          {selectedTickers.map((ticker, index) => (
            <Area
              key={ticker}
              type="monotone"
              dataKey={ticker}
              name={ticker}
              stroke={getTickerColor(ticker)}
              fill={getTickerColor(ticker)}
              fillOpacity={0.2}
              strokeWidth={2}
              connectNulls
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
