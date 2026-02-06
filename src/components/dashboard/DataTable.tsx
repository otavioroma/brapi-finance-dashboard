import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { FinancialData } from '@/types/financial';
import { formatCurrencyCompact, formatPercent, formatDecimal, getTickerLabel } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: FinancialData[];
}

type SortKey = keyof FinancialData;
type SortDirection = 'asc' | 'desc';

export const DataTable = ({ data }: DataTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('periodo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const HeaderCell = ({ column, label }: { column: SortKey; label: string }) => (
    <th
      onClick={() => handleSort(column)}
      className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon column={column} />
      </div>
    </th>
  );

  return (
    <div className="chart-container overflow-hidden">
      <h3 className="text-sm font-semibold mb-4">Dados Detalhados</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <HeaderCell column="ticker" label="Empresa" />
              <HeaderCell column="periodo" label="Período" />
              <HeaderCell column="receita" label="Receita" />
              <HeaderCell column="lucro" label="Lucro" />
              <HeaderCell column="ebitda" label="EBITDA" />
              <HeaderCell column="margem_ebitda" label="Margem EBITDA" />
              <HeaderCell column="roic" label="ROIC" />
              <HeaderCell column="capex_receita" label="Capex/Receita" />
              <HeaderCell column="alavancagem" label="Alavancagem" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.map((row, index) => {
              const highRisk = row.alavancagem !== null && row.alavancagem > 3;
              
              return (
                <tr
                  key={`${row.ticker}-${row.periodo}-${index}`}
                  className={cn(
                    "hover:bg-muted/30 transition-colors",
                    highRisk && "bg-destructive/5"
                  )}
                >
                  <td className="px-3 py-2 font-medium">
                    <div className="flex flex-col">
                      <span>{row.ticker}</span>
                      <span className="text-xs text-muted-foreground">
                        {getTickerLabel(row.ticker)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">{row.periodo}</td>
                  <td className="px-3 py-2 font-mono text-right">
                    {formatCurrencyCompact(row.receita)}
                  </td>
                  <td className={cn(
                    "px-3 py-2 font-mono text-right",
                    row.lucro !== null && row.lucro < 0 && "text-destructive"
                  )}>
                    {formatCurrencyCompact(row.lucro)}
                  </td>
                  <td className="px-3 py-2 font-mono text-right">
                    {formatCurrencyCompact(row.ebitda)}
                  </td>
                  <td className="px-3 py-2 font-mono text-right">
                    {formatPercent(row.margem_ebitda)}
                  </td>
                  <td className={cn(
                    "px-3 py-2 font-mono text-right",
                    row.roic !== null && row.roic < 0 && "text-destructive"
                  )}>
                    {formatPercent(row.roic)}
                  </td>
                  <td className="px-3 py-2 font-mono text-right">
                    {formatPercent(row.capex_receita)}
                  </td>
                  <td className={cn(
                    "px-3 py-2 font-mono text-right",
                    highRisk && "risk-high"
                  )}>
                    <div className="flex items-center justify-end gap-1">
                      {highRisk && <AlertTriangle className="h-3 w-3" />}
                      {row.alavancagem !== null ? `${formatDecimal(row.alavancagem)}x` : '—'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sortedData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum dado disponível para os filtros selecionados
        </div>
      )}
    </div>
  );
};
