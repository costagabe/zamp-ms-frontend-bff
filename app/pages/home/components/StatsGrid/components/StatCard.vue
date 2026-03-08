<template>
  <UCard>
    <div class="flex items-center gap-4">
      <div
        :class="[
          'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
          bgColor,
        ]"
      >
        <UIcon :name="icon" :class="['w-6 h-6', iconColor]" />
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
defineProps<{
  label: string
  value: string
  icon: string
  bgColor: string
  iconColor: string
}>()
</script>
