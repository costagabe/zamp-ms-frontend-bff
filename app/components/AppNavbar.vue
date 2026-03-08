<template>
  <header
    class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6"
  >
    <!-- Left -->
    <div class="flex items-center gap-3">
      <UButton
        variant="ghost"
        color="neutral"
        icon="i-lucide-menu"
        size="sm"
        class="lg:hidden"
        @click="emit('toggle-sidebar')"
      />

      <h1
        class="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block"
      >
        {{ pageTitle }}
      </h1>
    </div>

    <!-- Right -->
    <div class="flex items-center gap-2">
      <UButton variant="ghost" color="neutral" icon="i-lucide-bell" size="sm" />

      <UButton
        variant="ghost"
        color="neutral"
        :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
        size="sm"
        @click="toggleColorMode"
      />

      <UDropdownMenu :items="userMenuItems">
        <UButton variant="ghost" color="neutral" size="sm" class="gap-2">
          <UAvatar size="xs" icon="i-lucide-user" />
          <span class="hidden md:inline text-sm">Minha conta</span>
        </UButton>
      </UDropdownMenu>
    </div>
  </header>
</template>

<script lang="ts" setup>
const emit = defineEmits<{ "toggle-sidebar": [] }>();

const route = useRoute();
const colorMode = useColorMode();

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/buildings": "Imóveis",
  "/clients": "Clientes",
  "/contracts": "Contratos",
  "/rents": "Aluguéis",
  "/financial": "Financeiro",
  "/visits": "Visitas",
  "/maintenance": "Manutenções",
  "/settings": "Configurações",
};

const pageTitle = computed(() => {
  const match = Object.entries(pageTitles).find(([path]) => {
    if (path === "/") return route.path === "/";
    return route.path.startsWith(path);
  });
  return match?.[1] ?? "Zamp";
});

function toggleColorMode() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

const userMenuItems = [
  [
    { label: "Meu perfil", icon: "i-lucide-user", to: "/profile" },
    { label: "Configurações", icon: "i-lucide-settings", to: "/settings" },
  ],
  [
    {
      label: "Sair",
      icon: "i-lucide-log-out",
      click: () => navigateTo("/auth/login"),
    },
  ],
];
</script>
