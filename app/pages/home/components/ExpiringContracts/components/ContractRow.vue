<template>
  <tr>
    <td class="py-3 text-gray-900 dark:text-white">{{ address }}</td>
    <td class="py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{{ tenant }}</td>
    <td class="py-3">
      <UBadge color="warning" variant="soft" size="xs">{{ endDate }}</UBadge>
    </td>
    <td class="py-3 text-right font-medium text-gray-900 dark:text-white">{{ rentValue }}</td>
  </tr>
</template>

<script lang="ts" setup>
defineProps<{
  id: string
  address: string
  tenant: string
  endDate: string
  rentValue: string
}>()
</script>
