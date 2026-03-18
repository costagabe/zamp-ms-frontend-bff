# ZampDataTable

Documentação de uso do componente `ZampDataTable` e do composable `useZampDataTable`.

## Uso básico (com fetch automático)

O padrão recomendado é passar uma `fetchUrl` para o composable. Ele gerencia os dados, loading e erro internamente via `useFetch`, sem precisar de `@fetch` ou props manuais de dados.

```vue
<script lang="ts" setup>
import { useZampDataTable } from "~/composables/useZampDataTable";
import type { ZampDataTableColumn } from "~/types/zamp-data-table";

interface MyItem {
  id: string;
  name: string;
  status: string;
}

const columns: ZampDataTableColumn<MyItem>[] = [
  { key: "name", label: "Nome", sortable: true, filterable: true },
  { key: "status", label: "Status", type: "custom" },
];

const tableState = useZampDataTable<MyItem>(columns, {
  fetchUrl: "/api/my-resource",
});
</script>

<template>
  <ZampDataTable
    :columns="columns"
    :state="tableState"
    storage-key="my-table"
    empty-message="Nenhum item encontrado."
  >
    <template #toolbar>
      <UButton icon="i-lucide-plus" label="Novo" @click="openCreate" />
    </template>

    <template #cell-status="{ item }">
      <UBadge>{{ item.status }}</UBadge>
    </template>
  </ZampDataTable>
</template>
```

A API deve retornar um `PageResponse<T>`:

```ts
interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}
```

Os query params enviados automaticamente são:

- `page`, `pageSize`
- `sortField`, `sortDir` (quando há ordenação ativa)
- `filter_{key}` por cada filtro ativo

---

```ts
const tableState = useZampDataTable<T>(columns, options);
```

### Opções

| Opção             | Tipo        | Padrão                           | Descrição                                                                    |
| ----------------- | ----------- | -------------------------------- | ---------------------------------------------------------------------------- |
| `fetchUrl`        | `string`    | —                                | URL do BFF. Quando fornecida, o composable gerencia os dados via `useFetch`. |
| `defaultPage`     | `number`    | `1`                              | Página inicial                                                               |
| `defaultPageSize` | `number`    | `10`                             | Itens por página iniciais                                                    |
| `defaultSort`     | `SortState` | `{ field: '', direction: null }` | Ordenação inicial                                                            |
| `pageSizeOptions` | `number[]`  | `[5, 10, 25]`                    | Opções do seletor de page size                                               |
| `syncWithUrl`     | `boolean`   | `true`                           | Sincronizar estado com query params da URL                                   |

### Retorno

| Propriedade                                 | Tipo                       | Descrição                                       |
| ------------------------------------------- | -------------------------- | ----------------------------------------------- |
| `items`                                     | `ComputedRef<T[]>`         | Itens da página atual (populado via `fetchUrl`) |
| `total`                                     | `ComputedRef<number>`      | Total de elementos (populado via `fetchUrl`)    |
| `loading`                                   | `ComputedRef<boolean>`     | `true` enquanto a requisição está em curso      |
| `error`                                     | `ComputedRef<boolean>`     | `true` se a requisição falhou                   |
| `fetchParams`                               | `ComputedRef<FetchParams>` | Payload atual (page, pageSize, sort, filters)   |
| `page`, `pageSize`, `sort`, `filters`       | `Ref`                      | Estado individual                               |
| `setPage`, `setPageSize`                    | `fn`                       | Atualizar paginação                             |
| `toggleSort`                                | `fn(field)`                | Ciclar ordenação: asc → desc → neutro           |
| `setFilter`, `removeFilter`, `clearFilters` | `fn`                       | Gerenciar filtros (com debounce de 300ms)       |

---

## Props do componente `ZampDataTable`

| Prop              | Tipo                                     | Obrigatório | Descrição                                                          |
| ----------------- | ---------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `columns`         | `ZampDataTableColumn<T>[]`               | ✅          | Definição das colunas                                              |
| `state`           | `ReturnType<typeof useZampDataTable<T>>` | —           | Estado externo do composable (recomendado)                         |
| `items`           | `T[]`                                    | —           | Itens (apenas quando não usar `state` com `fetchUrl`)              |
| `total`           | `number`                                 | —           | Total de elementos (apenas quando não usar `state` com `fetchUrl`) |
| `loading`         | `boolean`                                | —           | Forçar estado de loading                                           |
| `error`           | `boolean \| string`                      | —           | Forçar estado de erro                                              |
| `emptyMessage`    | `string`                                 | —           | Mensagem do estado vazio                                           |
| `selectable`      | `boolean`                                | —           | Habilitar seleção de linhas                                        |
| `actions`         | `RowAction<T>[]`                         | —           | Ações por linha                                                    |
| `bulkActions`     | `BulkAction[]`                           | —           | Ações em lote                                                      |
| `density`         | `'comfortable' \| 'compact'`             | —           | Densidade visual das linhas                                        |
| `storageKey`      | `string`                                 | —           | Chave do localStorage para visibilidade de colunas                 |
| `pageSizeOptions` | `number[]`                               | —           | Opções do seletor de page size                                     |

### Quando `state` é passado, `items`/`total`/`loading`/`error` do composable têm prioridade sobre as props correspondentes.

---

## Colunas (`ZampDataTableColumn<T>`)

```ts
interface ZampDataTableColumn<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: "text" | "badge" | "date" | "boolean" | "avatar" | "custom";
  slotName?: string; // nome customizado do slot (padrão: key)
  hideOnMobile?: boolean; // ocultar em telas pequenas
}
```

---

## Slots

| Slot          | Descrição                                                          |
| ------------- | ------------------------------------------------------------------ |
| `#toolbar`    | Conteúdo do header (ex.: botão "Novo")                             |
| `#cell-{key}` | Renderização customizada de célula (para colunas `type: 'custom'`) |
| `#actions`    | Ações por linha completamente customizadas                         |
| `#empty`      | Conteúdo do estado vazio                                           |

Slot `#cell-{key}` recebe `{ item: T, value: any }`.

---

## Eventos

| Evento              | Payload                        | Descrição                                                 |
| ------------------- | ------------------------------ | --------------------------------------------------------- |
| `@retry`            | —                              | Emitido ao clicar em "Tentar novamente" no estado de erro |
| `@selection-change` | `T[]`                          | Emitido ao mudar a seleção de linhas                      |
| `@bulk-action`      | `(action: string, items: T[])` | Emitido ao acionar uma ação em lote                       |

> `@fetch` foi removido. O fetch é gerenciado internamente pelo composable via `useFetch`.

---

## Estrutura de arquivos

```
app/
  composables/
    useZampDataTable.ts
  components/
    ZampDataTable/
      ZampDataTable.vue           ← componente principal
      ZampDataTableHeader.vue
      ZampDataTableBody.vue
      ZampDataTablePagination.vue
      ZampDataTableBulkActions.vue
      ZampDataTableActiveFilters.vue
      ZampDataTableColumnToggle.vue
      exports.ts
  types/
    zamp-data-table.ts
```
