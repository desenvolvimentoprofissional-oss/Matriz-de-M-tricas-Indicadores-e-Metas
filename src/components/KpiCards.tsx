import { Award, BookOpenCheck, BriefcaseBusiness, Building2, GraduationCap, RefreshCw, Route, TrendingUp, UsersRound } from 'lucide-react';
import type { KpiDefinition } from '../types';
import { formatMetric } from '../lib/metrics';

const icons = {
  institutions: Building2,
  people: UsersRound,
  enrollments: BookOpenCheck,
  completions: GraduationCap,
  employment: BriefcaseBusiness,
  recognitions: Award,
  awards: Award,
  maintenance: RefreshCw,
  rate: TrendingUp,
  tracks: Route,
};

function KpiCard({ kpi }: { kpi: KpiDefinition }) {
  const Icon = icons[kpi.id as keyof typeof icons] ?? TrendingUp;
  return <article className="kpi-card" aria-label={kpi.label}>
    <div className="kpi-heading">
      <h3>{kpi.label}</h3>
      <span className="kpi-icon"><Icon size={24} strokeWidth={1.8} aria-hidden="true" /></span>
    </div>
    <p className="kpi-value" aria-label={kpi.value === null ? 'Valor ainda não apurado' : undefined}>
      {formatMetric(kpi.value, kpi.unit)}
    </p>
    <p className="kpi-description">{kpi.description}</p>
  </article>;
}

export function KpiCards({ kpis }: { kpis: readonly KpiDefinition[] }) {
  return <section className="kpi-grid" aria-label="Indicadores executivos">
    {kpis.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
  </section>;
}
