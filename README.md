# Matriz de Métricas, Indicadores e Metas

Página executiva do CRA-SP em React e TypeScript, com o padrão visual do Work: Plus Jakarta Sans, azul-marinho, botões de seleção, cartões brancos e tabelas com bordas discretas.

## Conteúdo

| Produto | Matriz integral |
| --- | ---: |
| Componente Curricular ASG e ODS | 13 itens |
| CRA-SP Educa | 13 itens |
| Programa de Desenvolvimento Profissional | 14 itens |

Cada produto apresenta quatro KPIs executivos, um gráfico de colunas e um gráfico de rosca na mesma linha em telas maiores, seguidos da matriz completa. No celular, os gráficos se empilham e a matriz mantém todas as colunas com rolagem horizontal.

O topo apresenta apenas o título da página e os botões **ASG e ODS**, **CRA-SP Educa** e **PDP CRA-SP**, com largura e altura iguais. Os nomes completos permanecem disponíveis ao passar o cursor sobre cada botão e na identificação acessível do conteúdo.

A matriz possui colunas separadas para número, eixo (componente, na matriz ASG e ODS), dimensão, momento/etapa, o que acompanhar, por que acompanhar, indicadores e metas. O PDP conserva a sequência Cursos Livres, Trilhas de Aprendizagem, Distinção Profissional, Pós-graduação e Certificações de Mercado, incluindo as duas modalidades dos dois últimos eixos.

## Dados e referências

Os valores executivos começam como `null`, exibidos como `—` e **Aguardando apuração**. Não há números demonstrativos, resultados simulados, percentuais presumidos ou conexão automática com bases de produção. Zero é reservado a uma medição real de zero.

Os percentuais e prazos das matrizes são referências de planejamento, separadas dos resultados de execução. Os modelos de ACTs e Termos do componente ASG e ODS são referências documentais; sua existência não comprova adesões ou resultados. O Educa identifica como declarados os dados de matrícula e contratação. O PDP prioriza a Distinção Profissional na visão executiva.

- `src/data/matrices/`: textos integrais das três matrizes de referência.
- `src/data/products.ts`: rótulos, definições dos KPIs, legendas e valores ainda não apurados.
- `src/components/`: navegação, cartões, gráficos e tabela integral.
- `src/lib/metrics.ts`: apresentação dos valores, preservando a diferença entre ausência e zero.

Para alimentar resultados reais posteriormente, preencher os valores dos KPIs e as séries dos gráficos no catálogo com informações apuradas e coerentes com os critérios de cada produto. Os dados desconhecidos devem continuar como `null`; a implementação não calcula resultados a partir das metas.

## Executar e verificar

Requer Node.js compatível com o Vite 8 e npm. A versão validada neste ambiente foi Node.js 24.

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm test
npm run build
```

O build é gerado em `dist/`. A página funciona sem chave de API ou configuração de servidor. Os links `#asg`, `#educa` e `#pdp` abrem diretamente o produto correspondente.

Os testes verificam a integridade dos 40 itens, a ordem dos eixos, as modalidades, a renderização dos oito campos e a ausência de dados de execução fictícios. A navegação por teclado, os três produtos, o atalho para o conteúdo e a apresentação em telas de 320, 390, 1024 e 1440 pixels também foram conferidos em Chromium.

Fonte Plus Jakarta Sans distribuída localmente, sob licença SIL Open Font License; licença em `public/fonts/OFL.txt`.
