<template>
  <ZampDataTable
    :columns="columns"
    :items="users"
    :total="totalUsers"
    :loading="loading"
    :error="error"
    :selectable="true"
    :actions="rowActions"
    :bulk-actions="bulkActions"
    storage-key="users-table"
    density="comfortable"
    @fetch="onFetch"
    @retry="onFetch(tableState.fetchParams.value)"
    @selection-change="onSelectionChange"
    @bulk-action="onBulkAction"
  >
    <template #toolbar>
      <UButton icon="i-lucide-plus" label="Novo usuário" @click="create" />
    </template>

    <!-- Custom cell slot -->
    <template #cell-role="{ item }">
      <UBadge :color="getRoleColor(item)">{{ item.role }}</UBadge>
    </template>

  </ZampDataTable>
</template>

<script setup lang="ts">
import type { ZampDataTableColumn, FetchParams } from '~/types/zamp-data-table'

interface User { id: string; name: string; email: string; role: string }

const columns: ZampDataTableColumn<User>[] = [
  { key: 'name', label: 'Nome', sortable: true, filterable: true, type: 'avatar' },
  { key: 'email', label: 'E-mail', sortable: true, filterable: true, hideOnMobile: true },
  { key: 'role', label: 'Papel', filterable: true, type: 'custom' },
]

const users = ref<User[]>([])
const totalUsers = ref(0)
const loading = ref(false)
const error = ref(false)

async function onFetch(params: FetchParams) {
  loading.value = true
  error.value = false
  try {
    const data = await $fetch('/api/users', { query: params })
    users.value = data.items
    totalUsers.value = data.total
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
