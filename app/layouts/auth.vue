<template>
  <div
    class="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-900 to-primary-800 p-4"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
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
