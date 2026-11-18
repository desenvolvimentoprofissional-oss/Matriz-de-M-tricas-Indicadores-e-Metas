import { ListChecks } from 'lucide-react';
import type { ProductDefinition } from '../types';

export function MatrixTable({ product }: { product: ProductDefinition }) {
  const titleId = `matrix-title-${product.id}`;
  return <section className="matrix-section" aria-labelledby={titleId}>
    <header className="matrix-heading">
      <div><div className="section-title"><ListChecks size={18} strokeWidth={1.6} aria-hidden="true" />
        <h3 id={titleId}>Matriz de métricas, indicadores e metas</h3></div>
        <p>{product.matrixDescription}</p>
      </div>
      <span className="matrix-count">{product.rows.length} itens</span>
    </header>
    <div className="matrix-card">
      <div className="matrix-reference-note">
        <span className="reference-dot" aria-hidden="true" />
        Referências de planejamento · metas e parâmetros não representam resultados de execução.
      </div>
      <div className="matrix-scroll" role="region" aria-label={`Matriz integral — ${product.name}`} tabIndex={0}>
        <table>
          <caption className="sr-only">Matriz integral de {product.name}, com {product.rows.length} itens.</caption>
          <colgroup><col className="col-number" /><col className="col-axis" /><col className="col-dimension" />
            <col className="col-stage" /><col className="col-monitor" /><col className="col-purpose" />
            <col className="col-indicators" /><col className="col-target" /></colgroup>
          <thead><tr><th scope="col">Nº</th><th scope="col">Eixo</th><th scope="col">Dimensão</th>
            <th scope="col">Momento / etapa</th><th scope="col">O que acompanhar</th>
            <th scope="col">Por que acompanhar</th><th scope="col">Indicadores</th>
            <th scope="col">{product.targetHeading}</th></tr></thead>
          <tbody>{product.rows.map((row) => <tr key={row.number}>
            <td className="matrix-number">{String(row.number).padStart(2, '0')}</td>
            <th scope="row">{row.axis}</th><td>{row.dimension}</td><td>{row.stage}</td>
            <td>{row.monitor}</td><td>{row.purpose}</td><td>{row.indicators}</td>
            <td className="matrix-target">{row.target}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <footer className="matrix-notes">
        <h4>Critérios de leitura</h4>
        <ul>{product.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </footer>
    </div>
  </section>;
}
