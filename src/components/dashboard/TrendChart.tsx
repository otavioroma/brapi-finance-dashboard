import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FinancialData } from '@/types/financial';
import { formatCurrencyCompact, getTickerLabel, getTickerColor } from '@/lib/formatters';
import { useMemo } from 'react';

interface TrendChartProps {
  data: FinancialData[];
  selectedTickers: string[];
}

export const TrendChart = ({ data, selectedTickers }: TrendChartProps) => {
  const chartData = useMemo(() => {
    const periodMap = new Map<string, Record<string, string | number | null>>();
    
    data.forEach(d => {
      if (!periodMap.has(d.periodo)) {
        periodMap.set(d.periodo, { periodo: d.periodo });
      }
      const entry = periodMap.get(d.periodo)!;
      entry[`${d.ticker}_receita`] = d.receita;
      entry[`${d.ticker}_lucro`] = d.lucro;
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
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{formatCurrencyCompact(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container h-[300px]">
      <h3 className="text-sm font-semibold mb-4">Evolução da Receita e Lucro</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="periodo"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis
            tickFormatter={(v) => formatCurrencyCompact(v)}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value) => {
              const [ticker, metric] = value.split('_');
              return `${getTickerLabel(ticker)} - ${metric === 'receita' ? 'Receita' : 'Lucro'}`;
            }}
          />
          {selectedTickers.map(ticker => (
            <Line
              key={`${ticker}_receita`}
              type="monotone"
              dataKey={`${ticker}_receita`}
              name={`${ticker}_receita`}
              stroke={getTickerColor(ticker)}
              strokeWidth={2}
              dot={{ fill: getTickerColor(ticker), r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
          {selectedTickers.map(ticker => (
            <Line
              key={`${ticker}_lucro`}
              type="monotone"
              dataKey={`${ticker}_lucro`}
              name={`${ticker}_lucro`}
              stroke={getTickerColor(ticker)}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: getTickerColor(ticker), r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
