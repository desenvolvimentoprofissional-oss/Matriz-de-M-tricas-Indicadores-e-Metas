import type { KpiDefinition } from '../types';

export function formatMetric(value: number | null, unit: KpiDefinition['unit']): string {
  if (value === null || !Number.isFinite(value)) return '—';
  const number = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: unit === 'percent' ? 1 : 0,
  }).format(value);
  return unit === 'percent' ? `${number}%` : number;
}
