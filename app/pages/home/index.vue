<template>
  <div class="space-y-6">
    <StatsGrid :stats="stats" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <RecentRents :rents="recentRents" />
      <QuickActions :actions="quickActions" />
    </div>

    <ExpiringContracts :contracts="expiringContracts" />
  </div>
</template>

<script lang="ts" setup>
import StatsGrid from "./components/StatsGrid/index.vue";
import RecentRents from "./components/RecentRents/index.vue";
import QuickActions from "./components/QuickActions.vue";
import ExpiringContracts from "./components/ExpiringContracts/index.vue";

definePageMeta({ layout: "default" });

const stats = [
  {
    label: "Imóveis",
    value: "48",
    icon: "i-lucide-building-2",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Contratos ativos",
    value: "32",
    icon: "i-lucide-file-text",
    bgColor: "bg-green-50 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    label: "Aluguéis pendentes",
    value: "7",
    icon: "i-lucide-clock",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Receita mensal",
    value: "R$ 84.500",
    icon: "i-lucide-trending-up",
    bgColor: "bg-primary-50 dark:bg-primary-900/30",
    iconColor: "text-primary-600 dark:text-primary-400",
  },
];

const recentRents = [
  {
    id: "1",
    address: "Rua das Flores, 123",
    tenant: "João Silva",
    dueDate: "10/03/2026",
    value: "R$ 2.500",
    statusLabel: "Pendente",
    statusColor: "warning" as const,
  },
  {
    id: "2",
    address: "Av. Brasil, 456",
    tenant: "Maria Santos",
    dueDate: "05/03/2026",
    value: "R$ 3.200",
    statusLabel: "Pago",
    statusColor: "success" as const,
  },
  {
    id: "3",
    address: "Rua Paraná, 789",
    tenant: "Carlos Oliveira",
    dueDate: "08/03/2026",
    value: "R$ 1.800",
    statusLabel: "Atrasado",
    statusColor: "error" as const,
  },
  {
    id: "4",
    address: "Rua XV, 321",
    tenant: "Ana Costa",
    dueDate: "15/03/2026",
    value: "R$ 4.100",
    statusLabel: "Pendente",
    statusColor: "warning" as const,
  },
];

const quickActions = [
  { label: "Novo imóvel", icon: "i-lucide-plus", to: "/buildings/new" },
  { label: "Novo cliente", icon: "i-lucide-user-plus", to: "/clients/new" },
  { label: "Novo contrato", icon: "i-lucide-file-plus", to: "/contracts/new" },
  { label: "Registrar pagamento", icon: "i-lucide-credit-card", to: "/rents" },
];

const expiringContracts = [
  {
    id: "1",
    address: "Rua das Flores, 123",
    tenant: "João Silva",
    endDate: "15/04/2026",
    rentValue: "R$ 2.500",
  },
  {
    id: "2",
    address: "Av. Paulista, 1000",
    tenant: "Pedro Lima",
    endDate: "20/04/2026",
    rentValue: "R$ 5.800",
  },
  {
    id: "3",
    address: "Rua Augusta, 555",
    tenant: "Fernanda Rocha",
    endDate: "01/05/2026",
    rentValue: "R$ 3.400",
  },
];
</script>
