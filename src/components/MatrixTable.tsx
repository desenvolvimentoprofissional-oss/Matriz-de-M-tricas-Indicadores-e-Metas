import { useState } from 'react';
import { Download, ListChecks } from 'lucide-react';
import type { ProductDefinition } from '../types';
import { downloadMatrix } from '../lib/exportMatrix';

export function MatrixTable({ product }: { product: ProductDefinition }) {
  const titleId = `matrix-title-${product.id}`;
  const verificationCount = product.rows.reduce((total, row) => total + row.verificationPoints.length, 0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  async function handleExport() {
    setIsExporting(true);
    setExportError(null);
    try {
      await downloadMatrix(product);
    } catch {
      setExportError('Não foi possível gerar o Excel. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  }
  return <section className="matrix-section" aria-labelledby={titleId}>
    <header className="matrix-heading">
      <div className="section-title"><ListChecks size={18} strokeWidth={1.6} aria-hidden="true" />
        <h3 id={titleId}>Matriz de métricas, indicadores e metas</h3>
      </div>
      <div className="matrix-actions">
        <div className="matrix-totals">
          <span className="matrix-count" title="Dimensões de acompanhamento">{product.rows.length} dimensões</span>
          <span className="matrix-count" title="Aspectos acompanhados nas dimensões da matriz">
            {verificationCount} pontos de verificação
          </span>
        </div>
        <button type="button" className="matrix-download" onClick={handleExport}
          disabled={isExporting} aria-busy={isExporting}>
          <Download size={15} strokeWidth={1.8} aria-hidden="true" />
          <span aria-live="polite">{isExporting ? 'Gerando Excel…' : 'Baixar Excel'}</span>
        </button>
      </div>
    </header>
    {exportError && <p role="alert" className="matrix-export-error">{exportError}</p>}
    <div className="matrix-card">
      <div className="matrix-scroll" role="region" aria-label={`Matriz integral — ${product.name}`} tabIndex={0}>
        <table>
          <caption className="sr-only">Matriz integral de {product.name}, com {product.rows.length} dimensões de acompanhamento e {verificationCount} pontos de verificação.</caption>
          <colgroup><col className="col-number" /><col className="col-axis" /><col className="col-dimension" />
            <col className="col-stage" /><col className="col-monitor" /><col className="col-purpose" />
            <col className="col-indicators" /><col className="col-target" /></colgroup>
          <thead><tr><th scope="col">Nº</th><th scope="col">{product.id === 'asg' ? 'Componente' : 'Eixo'}</th><th scope="col">Dimensão</th>
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
