import type { ProductDefinition } from '../types';
import { asgRows } from './matrices/asg';
import { educaRows } from './matrices/educa';
import { pdpRows } from './matrices/pdp';

const blue = '#24457d';
const teal = '#27877e';
const gold = '#c49535';
const slate = '#71839f';

export const products: readonly ProductDefinition[] = [
  {
    id: 'asg',
    label: 'ASG e ODS',
    name: 'Componente Curricular ASG e ODS',
    targetHeading: 'Metas sugeridas ou parâmetros dos modelos',
    rows: asgRows,
    notes: [
      'Os modelos dos ACTs preveem informações agregadas declaradas pelas IES, com fonte, período e data de atualização. Esses dados não equivalem a resultados auditados.',
      'Participantes e impactados conservam seus critérios de contagem. Os quantitativos não devem ser somados automaticamente como pessoas distintas.',
      'A conclusão considera o escopo adotado: integral, modular ou apoio docente. O uso de material de apoio não equivale automaticamente à conclusão das 24 horas.',
      'Os percentuais e as periodicidades sugeridos na matriz são propostas de gestão. Os parâmetros expressos nos modelos dos instrumentos estão identificados nas respectivas linhas.',
    ],
    kpis: [
      { id: 'institutions', label: 'Instituições aderentes', description: 'IES com adesão formalizada', unit: 'count', value: null },
      { id: 'people', label: 'Participações de estudantes', description: 'Quantitativos informados pelas IES', unit: 'count', value: null },
      { id: 'completions', label: 'Conclusões registradas', description: 'Concluintes no escopo adotado', unit: 'count', value: null },
      { id: 'rate', label: 'Taxa de conclusão', description: 'Participantes e concluintes da mesma coorte', unit: 'percent', value: null },
    ],
    columns: {
      title: 'Alcance e conclusão',
      description: 'Evolução dos registros de participação e conclusão por período.',
      categories: [
        { id: 'participants', label: 'Participações', color: blue },
        { id: 'completions', label: 'Conclusões', color: teal },
      ],
      points: null,
    },
    distribution: {
      title: 'Formatos de aplicação',
      description: 'Distribuição das aplicações declaradas pelas instituições.',
      categories: [
        { id: 'full', label: 'Adoção integral', color: blue },
        { id: 'modular', label: 'Inserção modular', color: teal },
        { id: 'support', label: 'Apoio docente', color: gold },
      ],
      points: null,
    },
  },
  {
    id: 'educa',
    label: 'CRA-SP Educa',
    name: 'CRA-SP Educa',
    targetHeading: 'Metas sugeridas',
    rows: educaRows,
    notes: [
      'Matrícula, candidatura e contratação são declaradas pelo usuário. A confirmação externa, quando existente, deve ser identificada separadamente.',
      'Certificado enviado e certificado validado são situações distintas. Conclusões registradas não incluem os certificados ainda em análise.',
      'Instituições participantes são as vinculadas às ofertas do Educa. O catálogo de IES utilizado no cadastro do estudante tem outra finalidade.',
      'As taxas comparam o mesmo grupo e período. Pessoas únicas são apresentadas separadamente dos registros de cursos ou vagas.',
    ],
    kpis: [
      { id: 'people', label: 'Usuários cadastrados', description: 'Pessoas com perfil completo no Educa', unit: 'count', value: null },
      { id: 'enrollments', label: 'Matrículas declaradas', description: 'Registros de matrícula informados', unit: 'count', value: null },
      { id: 'completions', label: 'Conclusões registradas', description: 'Jornadas de cursos com conclusão registrada', unit: 'count', value: null },
      { id: 'employment', label: 'Contratações declaradas', description: 'Registros informados na jornada de vagas', unit: 'count', value: null },
    ],
    columns: {
      title: 'Formação e oportunidades',
      description: 'Evolução dos resultados registrados nas duas jornadas.',
      categories: [
        { id: 'enrollments', label: 'Matrículas declaradas', color: blue },
        { id: 'completions', label: 'Conclusões registradas', color: teal },
        { id: 'employment', label: 'Contratações declaradas', color: gold },
      ],
      points: null,
    },
    distribution: {
      title: 'Interesse por frente',
      description: 'Distribuição dos registros de interesse em cursos e vagas.',
      categories: [
        { id: 'courses', label: 'Cursos', color: blue },
        { id: 'jobs', label: 'Vagas de mercado', color: teal },
      ],
      points: null,
    },
  },
  {
    id: 'pdp',
    label: 'PDP CRA-SP',
    name: 'Programa de Desenvolvimento Profissional',
    targetHeading: 'Metas sugeridas',
    rows: pdpRows,
    notes: [
      'A matriz está organizada na sequência dos eixos e mantém as duas modalidades de Pós-graduação e as duas modalidades de Certificações de Mercado.',
      'As metas apresentadas são referências propostas para o planejamento e precisam ser calibradas com a linha de base e as condições de execução.',
      'Satisfação em cada eixo: sugestão de 80% de avaliações positivas, correspondentes a notas 4 ou 5 em escala de 1 a 5.',
      'As pesquisas de satisfação, aplicação e trajetória profissional permanecem voluntárias. Os resultados devem informar quantidade de respostas, cobertura e limitações.',
    ],
    kpis: [
      { id: 'recognitions', label: 'Distinções vigentes', description: 'Concessões formalizadas e válidas', unit: 'count', value: null },
      { id: 'awards', label: 'Novas Distinções', description: 'Concessões formalizadas no período', unit: 'count', value: null },
      { id: 'maintenance', label: 'Taxa de manutenção', description: 'Distinções mantidas na coorte elegível', unit: 'percent', value: null },
      { id: 'tracks', label: 'Participantes nas Trilhas', description: 'Pessoas únicas com participação registrada', unit: 'count', value: null },
    ],
    columns: {
      title: 'Evolução da Distinção Profissional',
      description: 'Concessões e manutenções formalizadas por período.',
      categories: [
        { id: 'new', label: 'Novas Distinções', color: blue },
        { id: 'maintained', label: 'Distinções mantidas', color: teal },
      ],
      points: null,
    },
    distribution: {
      title: 'Acesso à formação avançada',
      description: 'Distribuição das adesões por modalidade de oferta.',
      categories: [
        { id: 'postgraduate-funded', label: 'Pós-graduação · bolsas', color: blue },
        { id: 'postgraduate-discount', label: 'Pós-graduação · descontos', color: teal },
        { id: 'certification-funded', label: 'Certificações · bolsas cedidas', color: gold },
        { id: 'certification-discount', label: 'Certificações · descontos', color: slate },
      ],
      points: null,
    },
  },
];
