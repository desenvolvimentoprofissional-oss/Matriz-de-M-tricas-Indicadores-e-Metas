import assert from 'node:assert/strict';
import test from 'node:test';
import ExcelJS from 'exceljs';
import { products } from '../src/data/products';
import { buildMatrixWorkbook } from '../src/lib/exportMatrix';
import type { ProductDefinition, ProductId } from '../src/types';

const expectedCounts: Record<ProductId, number> = { asg: 13, educa: 13, pdp: 14 };

async function reopen(product: ProductDefinition) {
  const original = await buildMatrixWorkbook(product);
  const bytes = await original.xlsx.writeBuffer();
  assert.deepEqual([...new Uint8Array(bytes).slice(0, 4)], [0x50, 0x4b, 0x03, 0x04]);
  const restored = new ExcelJS.Workbook();
  await restored.xlsx.load(bytes);
  return restored;
}

for (const product of products) {
  test(`XLSX ${product.id}: round-trip preserva oito colunas e a matriz integral`, async () => {
    const workbook = await reopen(product);
    assert.deepEqual(workbook.worksheets.map((sheet) => sheet.name), ['Matriz', 'Notas']);
    const matrix = workbook.getWorksheet('Matriz');
    assert.ok(matrix);
    assert.equal(matrix.columnCount, 8);
    assert.equal(matrix.rowCount, expectedCounts[product.id] + 1);
    assert.deepEqual(Array.from({ length: 8 }, (_, index) => matrix.getCell(1, index + 1).value), [
      'Nº', product.id === 'asg' ? 'Componente' : 'Eixo', 'Dimensão', 'Momento / etapa',
      'O que acompanhar', 'Por que acompanhar', 'Indicadores', product.targetHeading,
    ]);
    product.rows.forEach((row, index) => {
      const expected = [row.number, row.axis, row.dimension, row.stage,
        row.monitor, row.purpose, row.indicators, row.target];
      const values = Array.from({ length: 8 }, (_, column) => matrix.getCell(index + 2, column + 1).value);
      assert.deepEqual(values, expected, `linha ${row.number}, incluindo a última e a meta integral`);
    });
    const notes = workbook.getWorksheet('Notas');
    assert.ok(notes);
    assert.equal(notes.rowCount, product.notes.length + 1);
    assert.deepEqual(product.notes.map((_, index) => notes.getCell(index + 2, 2).value), product.notes);
    assert.equal(notes.getCell(1, 2).value, product.name);
    assert.equal(matrix.autoFilter, `A1:H${expectedCounts[product.id] + 1}`);
    assert.equal(matrix.views[0].state, 'frozen');
    assert.equal(matrix.getCell(2, 8).alignment.wrapText, true);
  });
}

test('textos iniciados por operadores permanecem texto literal, nunca fórmulas Excel', async () => {
  const source = products[0];
  const literalValues = ['=HYPERLINK("https://example.org","texto")', '+SUM(1,2)', '-1+2', '@SUM(A1:A2)'];
  const product: ProductDefinition = {
    ...source,
    rows: source.rows.map((row, index) => index === 0 ? {
      ...row, monitor: literalValues[0], purpose: literalValues[1],
      indicators: literalValues[2], target: literalValues[3],
    } : row),
    notes: [literalValues[0]],
  };
  const workbook = await reopen(product);
  const matrix = workbook.getWorksheet('Matriz');
  const notes = workbook.getWorksheet('Notas');
  assert.ok(matrix);
  assert.ok(notes);
  literalValues.forEach((value, index) => {
    const cell = matrix.getCell(2, index + 5);
    assert.equal(cell.value, value);
    assert.equal(cell.type, ExcelJS.ValueType.String);
    assert.equal(cell.formula, undefined);
  });
  assert.equal(notes.getCell(2, 2).value, literalValues[0]);
  assert.equal(notes.getCell(2, 2).type, ExcelJS.ValueType.String);
});
