/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import type { ProductId } from './types';
import { products } from './data/products';
import { ProductTabs } from './components/ProductTabs';
import { KpiCards } from './components/KpiCards';
import { ExecutiveCharts } from './components/Charts';
import { MatrixTable } from './components/MatrixTable';

function selectedProduct(): ProductId {
  const id = window.location.hash.slice(1);
  return products.find((product) => product.id === id)?.id ?? 'asg';
}

export default function App() {
  const [activeId, setActiveId] = useState<ProductId>(selectedProduct);
  const product = products.find((item) => item.id === activeId) ?? products[0];
  useEffect(() => {
    const onHashChange = () => setActiveId(selectedProduct());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  function selectProduct(id: ProductId) {
    setActiveId(id);
    window.history.replaceState(null, '', `#${id}`);
  }
  return <>
    <a className="skip-link" href="#executive-content" onClick={(event) => {
      event.preventDefault();
      document.getElementById('executive-content')?.focus();
    }}>Ir para o conteúdo</a>
    <main className="work-page-container">
      <header className="page-heading">
        <div className="page-title"><span>CRA-SP · Gestão e acompanhamento</span>
          <h1>Métricas, indicadores e metas</h1></div>
        <ProductTabs products={products} activeId={activeId} onSelect={selectProduct} />
      </header>
      {products.map((item) => <section key={item.id} id={`product-panel-${item.id}`} role="tabpanel"
        aria-labelledby={`product-tab-${item.id}`} className="product-panel" hidden={item.id !== activeId}>
        {item.id === activeId && <>
        <div id="executive-content" className="product-heading" tabIndex={-1}>
          <div><h2>{product.name}</h2><p>{product.subtitle}</p></div>
          <span className="data-status"><Activity size={13} strokeWidth={1.8} aria-hidden="true" />
            Aguardando apuração</span>
        </div>
        <KpiCards kpis={product.kpis} />
        <ExecutiveCharts product={product} />
        <MatrixTable product={product} />
        </>}
      </section>)}
      <footer className="page-footer">CRA-SP · Visão executiva e referências de acompanhamento</footer>
    </main>
  </>;
}
