<template>
  <div
    class="min-h-screen bg-linear-to-br from-primary-950 to-primary-800 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <AuthLoginBranding />

      <UCard class="shadow-2xl" :ui="{ body: 'p-8' }">
        <AuthLoginCardHeader />
        <AuthLoginForm />
      </UCard>

      <AuthLoginFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false });
</script>
