import { BarChart3, ChartPie } from 'lucide-react';
import type { ChartCategory, ProductDefinition } from '../types';

function Legend({ categories }: { categories: readonly ChartCategory[] }) {
  return <ul className="chart-legend" aria-label="Legenda do gráfico">
    {categories.map((category) => <li key={category.id}>
      <span style={{ backgroundColor: category.color }} aria-hidden="true" />{category.label}
    </li>)}
  </ul>;
}

function isCount(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function ColumnChart({ chart }: { chart: ProductDefinition['columns'] }) {
  const points = chart.points ?? [];
  const values = points.flatMap((point) => chart.categories.map((category) => point.values[category.id])).filter(isCount);
  const available = values.length > 0;
  const ceiling = Math.max(4, Math.ceil(Math.max(0, ...values) / 4) * 4);
  const groupWidth = 570 / Math.max(1, points.length);
  const barWidth = Math.min(32, groupWidth / (chart.categories.length + 2));
  return <figure className="chart-card column-card">
    <header className="chart-heading"><div className="section-title">
      <BarChart3 size={17} strokeWidth={1.6} aria-hidden="true" /><h3>{chart.title}</h3>
    </div><p>{chart.description}</p></header>
    <div className="column-plot">
      <svg viewBox="0 0 660 260" role="img" aria-label={available ? chart.title : `${chart.title}: dados ainda não apurados`}>
        {[0, 1, 2, 3, 4].map((tick) => <g key={tick}>
          <line x1="58" x2="628" y1={28 + tick * 42} y2={28 + tick * 42} className="plot-grid" />
          {available && <text x="46" y={32 + tick * 42} textAnchor="end" className="plot-label">
            {new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(ceiling * (4 - tick) / 4)}
          </text>}
        </g>)}
        <line x1="58" x2="628" y1="196" y2="196" className="plot-axis" />
        <text x="17" y="112" textAnchor="middle" transform="rotate(-90 17 112)" className="plot-label">Quantidade</text>
        {points.map((point, index) => <g key={point.label}>
          {chart.categories.map((category, series) => {
            const value = point.values[category.id];
            if (!isCount(value)) return null;
            const height = value / ceiling * 168;
            const x = 58 + groupWidth * (index + 0.5) + (series - chart.categories.length / 2) * (barWidth + 3);
            return <rect key={category.id} x={x} y={196 - height} width={barWidth} height={height}
              rx="3" fill={category.color}><title>{`${point.label} · ${category.label}: ${value}`}</title></rect>;
          })}
          <text x={58 + groupWidth * (index + 0.5)} y="218" textAnchor="middle" className="plot-label">{point.label}</text>
        </g>)}
        <text x="343" y="246" textAnchor="middle" className="plot-label">Período de referência</text>
      </svg>
      {!available && <div className="column-empty" aria-hidden="true">
        <p>Aguardando apuração</p><span>Os resultados serão exibidos após a consolidação dos dados.</span>
      </div>}
    </div>
    <Legend categories={chart.categories} />
  </figure>;
}

function DonutChart({ chart }: { chart: ProductDefinition['distribution'] }) {
  const categories = chart.categories.map((category) => ({
    ...category, value: chart.points?.find((point) => point.categoryId === category.id)?.value,
  }));
  const available = categories.length > 0 && categories.every((category) => isCount(category.value));
  const total = available ? categories.reduce((sum, category) => sum + (category.value ?? 0), 0) : null;
  let offset = 0;
  return <figure className="chart-card distribution-card">
    <header className="chart-heading"><div className="section-title">
      <ChartPie size={17} strokeWidth={1.6} aria-hidden="true" /><h3>{chart.title}</h3>
    </div><p>{chart.description}</p></header>
    <div className="distribution-content">
      <div className="donut-plot">
        <svg viewBox="0 0 220 220" role="img" aria-label={total === null ? `${chart.title}: dados ainda não apurados` : chart.title}>
          <circle cx="110" cy="110" r="76" fill="none" stroke="#edf0f5" strokeWidth="23" />
          {total !== null && total > 0 && categories.map((category) => {
            const portion = (category.value ?? 0) / total * 100;
            const start = offset;
            offset += portion;
            return <circle key={category.id} cx="110" cy="110" r="76" fill="none" stroke={category.color}
              strokeWidth="23" pathLength="100" strokeDasharray={`${portion} ${100 - portion}`}
              strokeDashoffset={-start} transform="rotate(-90 110 110)">
              <title>{`${category.label}: ${category.value}`}</title>
            </circle>;
          })}
          <text x="110" y="109" textAnchor="middle" className="donut-total">
            {total === null ? '—' : new Intl.NumberFormat('pt-BR').format(total)}
          </text>
          <text x="110" y="132" textAnchor="middle" className="donut-caption">
            {total === null ? 'A apurar' : 'Registros'}
          </text>
        </svg>
      </div>
      <Legend categories={chart.categories} />
    </div>
    <figcaption className="chart-footnote">
      {total === null ? 'Distribuição ainda não apurada.' : total === 0 ? 'Sem ocorrências no período.' : 'Distribuição dos registros no período.'}
    </figcaption>
  </figure>;
}

export function ExecutiveCharts({ product }: { product: ProductDefinition }) {
  return <section className="charts-grid" aria-label="Gráficos executivos">
    <ColumnChart chart={product.columns} /><DonutChart chart={product.distribution} />
  </section>;
}
