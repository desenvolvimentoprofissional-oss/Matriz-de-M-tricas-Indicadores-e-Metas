export type ProductId = 'asg' | 'educa' | 'pdp';

export interface MatrixRow {
  number: number;
  axis: string;
  dimension: string;
  stage: string;
  monitor: string;
  purpose: string;
  indicators: string;
  target: string;
  verificationPoints: readonly string[];
}

export interface KpiDefinition {
  id: string;
  label: string;
  description: string;
  unit: 'count' | 'percent';
  value: number | null;
}

export interface ChartCategory {
  id: string;
  label: string;
  color: string;
}

export interface ColumnPoint {
  label: string;
  values: Readonly<Record<string, number | null>>;
}

export interface DistributionPoint {
  categoryId: string;
  value: number | null;
}

export interface ProductDefinition {
  id: ProductId;
  label: string;
  name: string;
  targetHeading: string;
  rows: readonly MatrixRow[];
  notes: readonly string[];
  kpis: readonly KpiDefinition[];
  columns: {
    title: string;
    description: string;
    categories: readonly ChartCategory[];
    points: readonly ColumnPoint[] | null;
  };
  distribution: {
    title: string;
    description: string;
    categories: readonly ChartCategory[];
    points: readonly DistributionPoint[] | null;
  };
}
