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

      <div class="hidden md:block ml-6">
        <CompanySelector />
      </div>
    </div>

    <!-- Right -->
    <div class="flex items-center gap-2">
      <span
        class="hidden lg:inline text-sm text-gray-600 dark:text-gray-300 mr-1"
      >
        Bem-vindo, {{ welcomeName }}
      </span>

      <UButton variant="ghost" color="neutral" icon="i-lucide-bell" size="sm" />

      <ClientOnly>
        <UButton
          variant="ghost"
          color="neutral"
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          size="sm"
          @click="toggleColorMode"
        />
      </ClientOnly>

      <UDropdownMenu :items="userMenuItems">
        <UButton variant="ghost" color="neutral" size="sm" class="gap-2">
          <UAvatar size="xs" icon="i-lucide-user" />
          <span class="hidden md:inline text-sm">Minha conta</span>
        </UButton>
      </UDropdownMenu>

      <UButton
        variant="ghost"
        icon="i-lucide-log-out"
        size="sm"
        @click="handleLogout"
      />
    </div>
  </header>
</template>

<script lang="ts" setup>
import CompanySelector from "./CompanySelector.vue";
import type { User } from "~/types/user";

const emit = defineEmits<{ "toggle-sidebar": [] }>();

const route = useRoute();
const colorMode = useColorMode();
const authUser = useSupabaseUser();

const { data: loggedUser } = await useFetch<User>("/api/users/me");

const welcomeName = computed(() => {
  const name = loggedUser.value?.name?.trim();
  if (name) return name;

  const email = authUser.value?.email?.trim();
  if (email) {
    const localPart = email.split("@")[0];
    return localPart || email;
  }

  return "Usuário";
});

const pageTitles: Record<string, string> = {
  "/home": "Dashboard",
  "/buildings": "Imóveis",
  "/clients": "Clientes",
  "/contracts": "Contratos",
  "/rents": "Aluguéis",
  "/financial": "Financeiro",
  "/visits": "Visitas",
  "/maintenance": "Manutenções",
  "/settings": "Configurações",
  "/users": "Usuários",
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

async function handleLogout() {
  const supabase = useSupabaseClient();
  await supabase.auth.signOut();
  navigateTo("/auth/login");
}

const userMenuItems = [
  [
    { label: "Meu perfil", icon: "i-lucide-user", to: "/profile" },
    { label: "Configurações", icon: "i-lucide-settings", to: "/settings" },
  ],
];
</script>
