<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
  </div>
</template>

<script lang="ts" setup>
import StatCard from "./components/StatCard.vue";

interface Stat {
  label: string;
  value: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

defineProps<{ stats: Stat[] }>();
</script>
