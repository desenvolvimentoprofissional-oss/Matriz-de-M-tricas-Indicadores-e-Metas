import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { KpiCards } from '../src/components/KpiCards';
import { MatrixTable } from '../src/components/MatrixTable';
import { products } from '../src/data/products';
import { formatMetric } from '../src/lib/metrics';
import type { MatrixRow, ProductId } from '../src/types';

const requiredTextFields = [
  'axis', 'dimension', 'stage', 'monitor', 'purpose', 'indicators', 'target',
] as const satisfies readonly (keyof MatrixRow)[];

const expectedRowCounts: Record<ProductId, number> = { asg: 13, educa: 13, pdp: 15 };
const expectedVerificationCounts: Record<ProductId, number> = { asg: 48, educa: 34, pdp: 50 };
const pdpAxisOrder = [
  'Cursos Livres', 'Trilhas de Aprendizagem', 'Distinção Profissional',
  'Pós-graduação', 'Certificações de Mercado',
];

function product(id: ProductId) {
  const found = products.find((entry) => entry.id === id);
  assert.ok(found, `Produto obrigatório ausente: ${id}`);
  return found;
}

function normalized(value: string) {
  return value.trim().normalize('NFC').replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');
}

function textContent(markup: string) {
  const entities: Record<string, string> = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'",
  };
  return markup.replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot|#x27|#39);/g,
    (entity) => entities[entity]).trim();
}

test('o catálogo mantém as três matrizes e seus quantitativos completos', () => {
  assert.deepEqual(products.map((entry) => entry.id).sort(), ['asg', 'educa', 'pdp']);
  for (const entry of products) {
    assert.equal(entry.rows.length, expectedRowCounts[entry.id], entry.name);
    assert.deepEqual(entry.rows.map((row) => row.number),
      Array.from({ length: expectedRowCounts[entry.id] }, (_, index) => index + 1),
      `${entry.name}: sequência única, contínua e ordenada`);
  }
});

test('cada item da matriz contém os oito campos, sem dimensão confundida com eixo', () => {
  const axes = new Set(products.flatMap((entry) => entry.rows.map((row) => normalized(row.axis))));
  for (const entry of products) {
    for (const row of entry.rows) {
      assert.ok(Number.isInteger(row.number) && row.number > 0, `${entry.id}: número do item`);
      for (const field of requiredTextFields) {
        assert.equal(typeof row[field], 'string', `${entry.id}/${row.number}: ${field}`);
        assert.ok(row[field].trim(), `${entry.id}/${row.number}: ${field} vazio`);
      }
      assert.ok(!axes.has(normalized(row.dimension)),
        `${entry.id}/${row.number}: dimensão repetindo um eixo`);
    }
  }
});

test('os eixos do PDP aparecem em blocos consecutivos na ordem da jornada', () => {
  const axes = product('pdp').rows.map((row) => row.axis);
  const blocks = axes.filter((axis, index) => index === 0 || axis !== axes[index - 1]);
  assert.deepEqual(blocks, pdpAxisOrder);
});

test('os pontos são explícitos por dimensão e ASG 01 conserva as três verificações definidas', () => {
  assert.deepEqual(product('asg').rows[0].verificationPoints, [
    'Direitos de uso comprovados', 'Versão aprovada', 'Autorização vigente',
  ]);
  for (const entry of products) {
    for (const row of entry.rows) {
      assert.ok(row.verificationPoints.length > 0, `${entry.id}/${row.number}: pontos discriminados`);
      assert.ok(row.verificationPoints.every((point) => typeof point === 'string' && point.trim()),
        `${entry.id}/${row.number}: pontos preenchidos`);
      assert.equal(new Set(row.verificationPoints.map(normalized)).size, row.verificationPoints.length,
        `${entry.id}/${row.number}: sem repetir o mesmo ponto na dimensão`);
    }
  }
});

test('Pós-graduação e Certificações conservam suas duas modalidades distintas', () => {
  const rows = product('pdp').rows;
  const postgraduate = rows.filter((row) => row.axis === 'Pós-graduação');
  const certifications = rows.filter((row) => row.axis === 'Certificações de Mercado');
  assert.equal(postgraduate.length, 2);
  assert.equal(certifications.length, 2);
  assert.match(postgraduate[0].stage, /bolsas integrais custeadas pelo CRA-SP/i);
  assert.match(postgraduate[1].stage, /condições diferenciadas e descontos/i);
  assert.match(certifications[0].stage, /bolsas integrais cedidas pelas instituições/i);
  assert.match(certifications[1].stage, /descontos/i);
});

test('o catálogo inicial não apresenta metas ou exemplos como medições realizadas', () => {
  for (const entry of products) {
    assert.equal(entry.kpis.length, 4, `${entry.id}: quatro indicadores executivos`);
    assert.equal(new Set(entry.kpis.map((kpi) => kpi.id)).size, 4);
    for (const kpi of entry.kpis) {
      assert.equal(kpi.value, null, `${entry.id}/${kpi.id}: valor ainda não apurado`);
    }
    assert.equal(entry.columns.points, null, `${entry.id}: série temporal sem resultados`);
    assert.equal(entry.distribution.points, null, `${entry.id}: distribuição sem resultados`);
  }
});

test('ausência de medição é distinta de zero e percentuais conservam sua unidade', () => {
  assert.equal(formatMetric(null, 'count'), '—');
  assert.equal(formatMetric(null, 'percent'), '—');
  assert.equal(formatMetric(0, 'count'), '0');
  assert.equal(formatMetric(0, 'percent'), '0%');
  assert.equal(formatMetric(1250, 'count'), '1.250');
  assert.equal(formatMetric(79.4, 'percent'), '79,4%');
  assert.equal(formatMetric(12.5, 'percent'), '12,5%');
  for (const invalid of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    assert.equal(formatMetric(invalid, 'count'), '—');
    assert.equal(formatMetric(invalid, 'percent'), '—');
  }
});

test('os cartões renderizam os quatro indicadores reais como ainda não apurados', () => {
  for (const entry of products) {
    const markup = renderToStaticMarkup(createElement(KpiCards, { kpis: entry.kpis }));
    const values = [...markup.matchAll(/<p\b[^>]*aria-label="Valor ainda não apurado"[^>]*>(.*?)<\/p>/gs)];
    assert.equal((markup.match(/<article\b/g) ?? []).length, 4);
    assert.equal(values.length, 4);
    assert.deepEqual(values.map((match) => textContent(match[1])), ['—', '—', '—', '—']);
    for (const kpi of entry.kpis) assert.ok(textContent(markup).includes(kpi.label));
  }
});

test('a tabela integral renderiza oito colunas e todos os conteúdos de cada matriz', () => {
  for (const entry of products) {
    const markup = renderToStaticMarkup(createElement(MatrixTable, { product: entry }));
    const totals = [...markup.matchAll(/<span\b[^>]*class="matrix-count"[^>]*>(.*?)<\/span>/gs)]
      .map((match) => textContent(match[1]));
    assert.deepEqual(totals, [
      `${expectedRowCounts[entry.id]} dimensões`,
      `${expectedVerificationCounts[entry.id]} pontos de verificação`,
    ], `${entry.id}: totais de dimensões e pontos no cabeçalho`);
    const head = markup.match(/<thead\b[^>]*>(.*?)<\/thead>/s);
    const body = markup.match(/<tbody\b[^>]*>(.*?)<\/tbody>/s);
    assert.ok(head, `${entry.id}: cabeçalho da tabela`);
    assert.ok(body, `${entry.id}: corpo da tabela`);
    const headings = [...head[1].matchAll(/<th\b[^>]*>(.*?)<\/th>/gs)]
      .map((match) => textContent(match[1]));
    assert.deepEqual(headings, ['Nº', entry.id === 'asg' ? 'Componente' : 'Eixo', 'Dimensão', 'Momento / etapa',
      'O que acompanhar', 'Por que acompanhar', 'Indicadores', entry.targetHeading]);
    const renderedRows = [...body[1].matchAll(/<tr\b[^>]*>(.*?)<\/tr>/gs)];
    assert.equal(renderedRows.length, expectedRowCounts[entry.id]);
    renderedRows.forEach((rendered, index) => {
      const cells = [...rendered[1].matchAll(/<t[dh]\b[^>]*>(.*?)<\/t[dh]>/gs)]
        .map((match) => textContent(match[1]));
      const row = entry.rows[index];
      assert.equal(cells.length, 8, `${entry.id}/${row.number}: oito células`);
      assert.equal(Number(cells[0]), row.number);
      assert.deepEqual(cells.slice(1), requiredTextFields.map((field) => row[field]),
        `${entry.id}/${row.number}: conteúdo completo e na coluna correta`);
    });
  }
});
