import type { KeyboardEvent } from 'react';
import type { ProductDefinition, ProductId } from '../types';

interface Props {
  products: readonly ProductDefinition[];
  activeId: ProductId;
  onSelect: (id: ProductId) => void;
}

export function ProductTabs({ products, activeId, onSelect }: Props) {
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End'
      ? products.length - 1 : (index + step + products.length) % products.length;
    onSelect(products[next].id);
    document.getElementById(`product-tab-${products[next].id}`)?.focus();
  }

  return <div className="product-tabs-shell">
    <nav className="product-tabs" role="tablist" aria-label="Produtos acompanhados">
      {products.map((product, index) => <button
        key={product.id}
        type="button"
        role="tab"
        id={`product-tab-${product.id}`}
        title={product.name}
        aria-selected={product.id === activeId}
        aria-controls={`product-panel-${product.id}`}
        tabIndex={product.id === activeId ? 0 : -1}
        onClick={() => onSelect(product.id)}
        onKeyDown={(event) => navigate(event, index)}
      >{product.label}</button>)}
    </nav>
  </div>;
}
