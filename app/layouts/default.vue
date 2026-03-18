<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <AppSidebar
      :open="sidebarOpen"
      :collapsed="sidebarCollapsed"
      @close="sidebarOpen = false"
      @toggle-collapse="sidebarCollapsed = !sidebarCollapsed"
    />

    <!-- Overlay mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <div class="flex-1 flex flex-col overflow-hidden">
      <AppNavbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppNavbar from "~/components/global/AppNavbar.vue";
import AppSidebar from "~/components/global/AppSidebar.vue";

const sidebarOpen = ref(false);
const sidebarCollapsed = ref(false);

const route = useRoute();
const APP_NAME = "Zamp";

useHead(
  computed(() => {
    const pageTitle = route.meta?.title as string | undefined;
    return {
      title: pageTitle ? `${pageTitle} | ${APP_NAME}` : APP_NAME,
    };
  }),
);
</script>
