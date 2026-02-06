// Brazilian currency and percentage formatters

export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '—';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCurrencyCompact = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '—';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e9) {
    return `${sign}R$ ${(absValue / 1e9).toFixed(1)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}R$ ${(absValue / 1e6).toFixed(1)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}R$ ${(absValue / 1e3).toFixed(1)}K`;
  }
  
  return formatCurrency(value);
};

export const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '—';
  
  return `${value.toFixed(1)}%`;
};

export const formatDecimal = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined || isNaN(value)) return '—';
  
  return value.toFixed(decimals);
};

export const getTickerLabel = (ticker: string): string => {
  const labels: Record<string, string> = {
    'VIVT3': 'Vivo',
    'TIMS3': 'TIM',
    'BRIT3': 'Brisanet',
    'DESK3': 'Desktop',
    'FIQE3': 'Unifique',
  };
  return labels[ticker] || ticker;
};

export const getTickerColor = (ticker: string): string => {
  const colors: Record<string, string> = {
    'VIVT3': 'hsl(199, 89%, 48%)',
    'TIMS3': 'hsl(142, 76%, 36%)',
    'DESK3': 'hsl(38, 92%, 50%)',
    'FIQE3': 'hsl(280, 65%, 60%)',
    'BRIT3': 'hsl(0, 72%, 51%)',
  };
  return colors[ticker] || 'hsl(215, 16%, 47%)';
};
