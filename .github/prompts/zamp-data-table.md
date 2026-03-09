Crie um componente global em app/components ZampDataTable com as seguintes caracteristicas:

## Colunas e Tipagem

- O componente deve ser totalmente tipado com TypeScript Generics (`ZampDataTable<T>`), onde `T` representa o tipo de cada linha da tabela.
- No header de cada coluna, receber a opcao se o campo é filtravel, ordenavel e seu tipo (`text`, `badge`, `date`, `boolean`, `avatar`, `custom`).
- Para colunas do tipo `custom`, expor um scoped slot nomeado `#cell-{field}` onde o consumidor pode renderizar qualquer conteúdo, recebendo o item da linha como prop.
- Suportar uma prop `columns` que define as colunas: `{ key, label, sortable?, filterable?, type?, slotName? }`.

## Filtros e Busca

- No header da tabela, exibir campos de busca para cada coluna marcada como `filterable`.
- Mais de 1 campo pode ser filtrado simultaneamente.
- Aplicar **debounce** nos inputs de busca (300ms) para evitar requisicoes excessivas ao servidor.
- Os filtros ativos devem ser visíveis como **tags/badges removíveis** no topo da tabela, permitindo limpar filtros individualmente ou todos de uma vez.

## Ordenação

- Colunas marcadas como `sortable` devem exibir ícones de seta indicando a direcao atual (asc/desc/neutro), clicáveis no header.
- Apenas um campo ativo de ordenação por vez.

## Paginação

- Paginação no rodapé com controles de página (anterior, próxima, primeira, última).
- Seletor de itens por página com opcoes configuráveis via prop `pageSizeOptions` (padrão: `[5, 10, 25]`).
- Exibir contador de itens no formato `"Mostrando X–Y de Z resultados"`.

## Server-Side

- Todas as operações (busca, ordenacao, paginacao) devem ser enviadas ao servidor via parametros de query.
- O componente deve emitir um evento `@fetch` com o payload `{ page, pageSize, sort: { field, direction }, filters: Record<string, string> }` sempre que qualquer parametro mudar.
- O consumidor é responsável por chamar a API e passar a prop `loading` e `items` de volta ao componente.

## Estado da URL (Query Params)

- Sincronizar automaticamente o estado atual de paginacao, ordenacao e filtros com os query params da URL usando `useRoute` e `useRouter`.
- Isso preserva o estado ao navegar entre páginas e ao recarregar o browser.

## Estados da Tabela

- **Loading**: exibir skeleton rows animados (não apenas um spinner) enquanto `loading` for `true`, respeitando o número de colunas e o `pageSize` atual.
- **Empty**: estado vazio customizável via slot `#empty` (padrão: ícone + mensagem configurável via prop `emptyMessage`).
- **Error**: se a prop `error` for passada como `true` (ou com uma mensagem), exibir estado de erro com opção de retentar via evento `@retry`.

## Seleção e Ações em Lote

- Suportar seleção múltipla de linhas via checkbox na primeira coluna (ativado pela prop `selectable`).
- Quando houver linhas selecionadas, exibir uma barra de ações em lote (bulk actions) no header com as ações configuradas via prop `bulkActions: { label, icon, action }[]`.
- Emitir evento `@selection-change` com os itens selecionados.

## Coluna de Ações por Linha

- A última coluna deve ser uma coluna de acoes configurável via prop `actions: { label, icon, color, handler, visible?: (item) => boolean }[]`.
- Suportar também um slot `#actions` para renderização completamente customizada dos botões de ação por linha.

## Toolbar (Slot de Cabeçalho)

- Expor um slot `#toolbar` no header do card para que o consumidor possa adicionar botões (ex.: "Novo item") alinhados ao lado dos filtros.

## Visibilidade de Colunas

- Incluir um botão/dropdown no header que permite ao usuário mostrar ou ocultar colunas individualmente.
- O estado de visibilidade deve ser persistido no `localStorage` por uma chave configurável via prop `storageKey`.

## Design e Responsividade

- Design clean seguindo o padrao visual do Zamp (Nuxt UI: `UCard`, `UInput`, `UButton`, `UBadge`, `UIcon`, `USkeleton`, `UDropdown`).
- Em telas pequenas, colunas marcadas com `hideOnMobile: true` devem ser ocultadas automaticamente.
- Suportar modo compacto via prop `density: 'comfortable' | 'compact'` que ajusta o padding das células.

## Composable `useZampDataTable`

- Criar um composable `app/composables/useZampDataTable.ts` que encapsula toda a lógica de estado do componente:
  - Gerencia `page`, `pageSize`, `sort`, `filters`.
  - Expõe `fetchParams` (computed) com o payload pronto para enviar ao servidor.
  - Sincroniza com query params da URL.
  - Aplica debounce nos filtros.
- O componente `ZampDataTable` deve aceitar que o estado seja controlado externamente via esse composable (opcional), permitindo usos mais avançados.

## Pontos importantes

Provavelmente esse componente será grande, então é importante dividir a implementação em subcomponentes menores (ex.: `ZampDataTableHeader`, `ZampDataTableRow`, `ZampDataTablePagination`, etc.) para manter a organização e legibilidade do código. Cada subcomponente deve ter uma única responsabilidade clara, seguindo o princípio de responsabilidade única do SOLID. Crie uma pasta `components/ZampDataTable` e coloque os arquivos lá, exportando o componente principal via `index.ts`.
