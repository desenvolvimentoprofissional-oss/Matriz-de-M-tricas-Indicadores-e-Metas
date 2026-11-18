import type { Workbook, Worksheet } from 'exceljs';
import type { ProductDefinition, ProductId } from '../types';

const fileNames: Record<ProductId, string> = {
  asg: 'matriz-asg-e-ods.xlsx',
  educa: 'matriz-cra-sp-educa.xlsx',
  pdp: 'matriz-programa-desenvolvimento-profissional.xlsx',
};

function styleSheet(sheet: Worksheet) {
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  sheet.pageSetup = {
    orientation: 'landscape', paperSize: 9, fitToPage: true, fitToWidth: 1,
    fitToHeight: 0, printTitlesRow: '1:1',
  };
  sheet.eachRow((row, rowNumber) => {
    let lines = 1;
    row.eachCell((cell, columnNumber) => {
      const width = sheet.getColumn(columnNumber).width ?? 24;
      const content = String(cell.value ?? '');
      const cellLines = content.split('\n').reduce((sum, line) =>
        sum + Math.max(1, Math.ceil(line.length / (width * 0.85))), 0);
      lines = Math.max(lines, cellLines);
      cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF172554' } };
      cell.alignment = { vertical: 'top', wrapText: true };
      if (rowNumber === 1) {
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF172554' } };
      } else if (rowNumber % 2 === 0) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF4F7FB' } };
      }
    });
    row.height = Math.min(409, Math.max(rowNumber === 1 ? 36 : 30, lines * 16 + 10));
  });
}

export async function buildMatrixWorkbook(product: ProductDefinition): Promise<Workbook> {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CRA-SP';
  workbook.title = `Matriz de métricas, indicadores e metas — ${product.name}`;
  const matrix = workbook.addWorksheet('Matriz');
  const headings = ['Nº', product.id === 'asg' ? 'Componente' : 'Eixo', 'Dimensão', 'Momento / etapa',
    'O que acompanhar', 'Por que acompanhar', 'Indicadores', product.targetHeading];
  const widths = [7, 26, 31, 36, 52, 54, 65, 72];
  matrix.columns = headings.map((header, index) => ({ header, width: widths[index] }));
  for (const row of product.rows) {
    matrix.addRow([row.number, row.axis, row.dimension, row.stage,
      row.monitor, row.purpose, row.indicators, row.target]);
  }
  matrix.autoFilter = `A1:H${product.rows.length + 1}`;
  styleSheet(matrix);

  const notes = workbook.addWorksheet('Notas');
  notes.columns = [{ header: 'Critério de leitura', width: 42 }, { header: product.name, width: 120 }];
  product.notes.forEach((note, index) => notes.addRow([`Critério de leitura ${index + 1}`, note]));
  styleSheet(notes);
  return workbook;
}

export async function downloadMatrix(product: ProductDefinition): Promise<void> {
  const workbook = await buildMatrixWorkbook(product);
  const buffer = await workbook.xlsx.writeBuffer();
  const bytes = new Uint8Array(buffer);
  const blob = new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const anchor = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  try {
    anchor.href = objectUrl;
    anchor.download = fileNames[product.id];
    document.body.append(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}
