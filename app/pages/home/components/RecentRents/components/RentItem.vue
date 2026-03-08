<template>
  <div class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
    <div>
      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ address }}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ tenant }} · {{ dueDate }}</p>
    </div>
    <div class="text-right">
      <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ value }}</p>
      <UBadge :color="statusColor" variant="soft" size="xs">{{ statusLabel }}</UBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  id: string
  address: string
  tenant: string
  dueDate: string
  value: string
  statusLabel: string
  statusColor: 'warning' | 'success' | 'error'
}>()
</script>
