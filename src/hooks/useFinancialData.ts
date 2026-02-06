import { useState, useEffect, useMemo } from 'react';
import { FinancialData, FilterState } from '@/types/financial';

const parseCSV = (text: string): FinancialData[] => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: Record<string, string | number | null> = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      
      if (['receita', 'lucro', 'ebitda', 'margem_ebitda', 'roic', 'capex', 'capex_receita', 'alavancagem'].includes(header)) {
        row[header] = value && value.trim() !== '' ? parseFloat(value) : null;
      } else {
        row[header] = value;
      }
    });
    
    return row as unknown as FinancialData;
  });
};

export const useFinancialData = () => {
  const [data, setData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    tickers: [],
    periodos: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/saida_financeira.csv');
        const text = await response.text();
        const parsed = parseCSV(text);
        setData(parsed);
        
        // Set default filters to include all tickers
        const uniqueTickers = [...new Set(parsed.map(d => d.ticker))];
        setFilters(prev => ({ ...prev, tickers: uniqueTickers }));
      } catch (err) {
        setError('Erro ao carregar dados financeiros');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const availableTickers = useMemo(() => {
    return [...new Set(data.map(d => d.ticker))];
  }, [data]);

  const availablePeriodos = useMemo(() => {
    const periodos = [...new Set(data.map(d => d.periodo))];
    return periodos.sort((a, b) => {
      const [qA, yA] = a.match(/(\d)T(\d{4})/)?.slice(1) || [];
      const [qB, yB] = b.match(/(\d)T(\d{4})/)?.slice(1) || [];
      if (yA !== yB) return parseInt(yA) - parseInt(yB);
      return parseInt(qA) - parseInt(qB);
    });
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(d => {
      const tickerMatch = filters.tickers.length === 0 || filters.tickers.includes(d.ticker);
      const periodoMatch = filters.periodos.length === 0 || filters.periodos.includes(d.periodo);
      return tickerMatch && periodoMatch;
    });
  }, [data, filters]);

  const validData = useMemo(() => {
    return filteredData.filter(d => d.receita !== null);
  }, [filteredData]);

  return {
    data: filteredData,
    validData,
    loading,
    error,
    filters,
    setFilters,
    availableTickers,
    availablePeriodos,
  };
};
