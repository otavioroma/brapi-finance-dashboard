export interface FinancialData {
  ticker: string;
  tipo_dados: string;
  periodo: string;
  receita: number | null;
  lucro: number | null;
  ebitda: number | null;
  margem_ebitda: number | null;
  roic: number | null;
  capex: number | null;
  capex_receita: number | null;
  alavancagem: number | null;
}

export interface FilterState {
  tickers: string[];
  periodos: string[];
}

export interface KPIData {
  receitaTotal: number;
  margemEbitdaMedia: number;
  alavancagemMedia: number;
}
