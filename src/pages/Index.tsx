import { useMemo } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { FilterSidebar } from '@/components/dashboard/FilterSidebar';
import { KPICard } from '@/components/dashboard/KPICard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { EfficiencyChart } from '@/components/dashboard/EfficiencyChart';
import { CapexChart } from '@/components/dashboard/CapexChart';
import { DataTable } from '@/components/dashboard/DataTable';
import { formatCurrencyCompact, formatPercent, formatDecimal } from '@/lib/formatters';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const {
    data,
    validData,
    loading,
    error,
    filters,
    setFilters,
    availableTickers,
    availablePeriodos,
  } = useFinancialData();

  const kpis = useMemo(() => {
    if (validData.length === 0) {
      return { receitaTotal: 0, margemEbitdaMedia: 0, alavancagemMedia: 0 };
    }

    const receitaTotal = validData
      .filter(d => d.receita !== null)
      .reduce((sum, d) => sum + (d.receita || 0), 0);

    const margemValues = validData
      .filter(d => d.margem_ebitda !== null && d.margem_ebitda > -100 && d.margem_ebitda < 200)
      .map(d => d.margem_ebitda!);
    const margemEbitdaMedia = margemValues.length > 0
      ? margemValues.reduce((a, b) => a + b, 0) / margemValues.length
      : 0;

    const alavancagemValues = validData
      .filter(d => d.alavancagem !== null && d.alavancagem > -10 && d.alavancagem < 50)
      .map(d => d.alavancagem!);
    const alavancagemMedia = alavancagemValues.length > 0
      ? alavancagemValues.reduce((a, b) => a + b, 0) / alavancagemValues.length
      : 0;

    return { receitaTotal, margemEbitdaMedia, alavancagemMedia };
  }, [validData]);

  const highRiskCount = useMemo(() => {
    return validData.filter(d => d.alavancagem !== null && d.alavancagem > 3).length;
  }, [validData]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center text-destructive">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        availableTickers={availableTickers}
        availablePeriodos={availablePeriodos}
      />

      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard Financeiro — Telecomunicações
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Análise comparativa das empresas do setor: Vivo, TIM, Desktop e Unifique
          </p>
        </header>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
            <Skeleton className="h-[300px]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Skeleton className="h-[300px]" />
              <Skeleton className="h-[300px]" />
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KPICard
                title="Receita Total"
                value={formatCurrencyCompact(kpis.receitaTotal)}
                subtitle={`${validData.length} registros`}
                icon={DollarSign}
              />
              <KPICard
                title="Margem EBITDA Média"
                value={formatPercent(kpis.margemEbitdaMedia)}
                subtitle="Eficiência operacional"
                icon={TrendingUp}
                trend={kpis.margemEbitdaMedia > 25 ? 'up' : kpis.margemEbitdaMedia < 15 ? 'down' : 'neutral'}
              />
              <KPICard
                title="Alavancagem Média"
                value={`${formatDecimal(kpis.alavancagemMedia)}x`}
                subtitle="Dívida Líq./EBITDA"
                icon={BarChart3}
                alert={kpis.alavancagemMedia > 3}
              />
              <KPICard
                title="Alertas de Risco"
                value={`${highRiskCount}`}
                subtitle="Alavancagem > 3.0x"
                icon={AlertTriangle}
                alert={highRiskCount > 0}
              />
            </div>

            {/* Trend Chart */}
            <div className="mb-6">
              <TrendChart data={validData} selectedTickers={filters.tickers} />
            </div>

            {/* Efficiency and Capex Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <EfficiencyChart data={validData} />
              <CapexChart data={validData} selectedTickers={filters.tickers} />
            </div>

            {/* Data Table */}
            <DataTable data={data} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
