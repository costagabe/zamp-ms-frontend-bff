<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          <th class="pb-3 font-medium">Imóvel</th>
          <th class="pb-3 font-medium hidden sm:table-cell">Inquilino</th>
          <th class="pb-3 font-medium">Vencimento</th>
          <th class="pb-3 font-medium text-right">Valor</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <ContractRow v-for="contract in contracts" :key="contract.id" v-bind="contract" />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import ContractRow from './ContractRow.vue'

interface Contract {
  id: string
  address: string
  tenant: string
  endDate: string
  rentValue: string
}

defineProps<{ contracts: Contract[] }>()
</script>
