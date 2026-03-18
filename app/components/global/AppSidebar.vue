<template>
  <!-- Mobile sidebar -->
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
      'lg:static lg:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full',
      collapsed ? 'lg:w-18 w-64' : 'w-64',
    ]"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700"
    >
      <NuxtLink to="/home" class="flex items-center gap-2 overflow-hidden">
        <div
          class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center"
        >
          <UIcon name="i-lucide-building-2" class="w-5 h-5 text-white" />
        </div>
        <span
          v-show="!collapsed"
          class="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap"
        >
          Zamp
        </span>
      </NuxtLink>

      <!-- Close mobile -->
      <UButton
        variant="ghost"
        color="neutral"
        icon="i-lucide-x"
        size="sm"
        class="lg:hidden"
        @click="emit('close')"
      />

      <!-- Collapse desktop -->
      <UButton
        variant="ghost"
        color="neutral"
        :icon="collapsed ? 'i-lucide-chevrons-right' : 'i-lucide-chevrons-left'"
        size="sm"
        class="hidden lg:flex"
        @click="emit('toggle-collapse')"
      />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        :class="[
          isActive(item.to)
            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white',
        ]"
        @click="closeMobileOnNav"
      >
        <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
        <span v-show="!collapsed" class="whitespace-nowrap">{{
          item.label
        }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div
      v-if="showSettings"
      class="border-t border-gray-200 dark:border-gray-700 p-3"
    >
      <NuxtLink
        to="/settings"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        @click="closeMobileOnNav"
      >
        <UIcon name="i-lucide-settings" class="w-5 h-5 flex-shrink-0" />
        <span v-show="!collapsed" class="whitespace-nowrap">Configurações</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<script lang="ts" setup>
defineProps<{ open: boolean; collapsed: boolean }>();
const emit = defineEmits<{ close: []; "toggle-collapse": [] }>();

const route = useRoute();

interface SidebarItem {
  label: string;
  icon: string;
  to: string;
}

interface SidebarNavigationResponse {
  roles: string[];
  menuItems: SidebarItem[];
  showSettings: boolean;
}

const fallbackMenuItems: SidebarItem[] = [
  { label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/" },
  { label: "Imóveis", icon: "i-lucide-building-2", to: "/buildings" },
  { label: "Clientes", icon: "i-lucide-users", to: "/clients" },
  { label: "Contratos", icon: "i-lucide-file-text", to: "/contracts" },
  { label: "Aluguéis", icon: "i-lucide-wallet", to: "/rents" },
  { label: "Financeiro", icon: "i-lucide-bar-chart-3", to: "/financial" },
  { label: "Visitas", icon: "i-lucide-calendar", to: "/visits" },
  { label: "Manutenções", icon: "i-lucide-wrench", to: "/maintenance" },
];

const { data: navigationData } = await useFetch<SidebarNavigationResponse>(
  "/api/navigation/sidebar",
);

const menuItems = computed<SidebarItem[]>(
  () => navigationData.value?.menuItems ?? fallbackMenuItems,
);

const showSettings = computed<boolean>(
  () => navigationData.value?.showSettings ?? false,
);

function isActive(to: string) {
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to);
}

function closeMobileOnNav() {
  if (window.innerWidth < 1024) emit("close");
}
</script>
