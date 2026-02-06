import { Check, Filter, X } from 'lucide-react';
import { FilterState } from '@/types/financial';
import { getTickerLabel } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableTickers: string[];
  availablePeriodos: string[];
}

export const FilterSidebar = ({
  filters,
  setFilters,
  availableTickers,
  availablePeriodos,
}: FilterSidebarProps) => {
  const toggleTicker = (ticker: string) => {
    setFilters(prev => ({
      ...prev,
      tickers: prev.tickers.includes(ticker)
        ? prev.tickers.filter(t => t !== ticker)
        : [...prev.tickers, ticker],
    }));
  };

  const togglePeriodo = (periodo: string) => {
    setFilters(prev => ({
      ...prev,
      periodos: prev.periodos.includes(periodo)
        ? prev.periodos.filter(p => p !== periodo)
        : [...prev.periodos, periodo],
    }));
  };

  const selectAllTickers = () => {
    setFilters(prev => ({ ...prev, tickers: availableTickers }));
  };

  const clearTickers = () => {
    setFilters(prev => ({ ...prev, tickers: [] }));
  };

  const clearPeriodos = () => {
    setFilters(prev => ({ ...prev, periodos: [] }));
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 overflow-y-auto">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 text-sidebar-foreground">
          <Filter className="h-5 w-5" />
          <h2 className="font-semibold">Filtros</h2>
        </div>
      </div>

      {/* Ticker Filter */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-sidebar-foreground">Empresas</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAllTickers}
              className="h-6 px-2 text-xs text-sidebar-foreground hover:bg-sidebar-accent"
            >
              Todas
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearTickers}
              className="h-6 px-2 text-xs text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          {availableTickers.map(ticker => (
            <button
              key={ticker}
              onClick={() => toggleTicker(ticker)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                filters.tickers.includes(ticker)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded border flex items-center justify-center",
                filters.tickers.includes(ticker)
                  ? "bg-sidebar-primary-foreground border-transparent"
                  : "border-sidebar-foreground/30"
              )}>
                {filters.tickers.includes(ticker) && (
                  <Check className="h-3 w-3 text-sidebar-primary" />
                )}
              </div>
              <span className="font-medium">{ticker}</span>
              <span className="text-xs opacity-70">{getTickerLabel(ticker)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Periodo Filter */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-sidebar-foreground">Períodos</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearPeriodos}
            className="h-6 px-2 text-xs text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {filters.periodos.length > 0 ? <X className="h-3 w-3" /> : 'Todos'}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {availablePeriodos.map(periodo => (
            <button
              key={periodo}
              onClick={() => togglePeriodo(periodo)}
              className={cn(
                "px-2 py-1.5 rounded text-xs font-medium transition-colors",
                filters.periodos.includes(periodo)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : filters.periodos.length === 0
                    ? "bg-sidebar-accent/50 text-sidebar-foreground"
                    : "text-sidebar-foreground/50 hover:bg-sidebar-accent"
              )}
            >
              {periodo}
            </button>
          ))}
        </div>
        {filters.periodos.length === 0 && (
          <p className="text-xs text-sidebar-foreground/50 mt-2">
            Todos os períodos selecionados
          </p>
        )}
      </div>
    </aside>
  );
};
