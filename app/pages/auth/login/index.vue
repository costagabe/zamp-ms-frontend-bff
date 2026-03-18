<template>
  <div class="w-full max-w-md">
    <Branding />

    <UCard class="shadow-2xl" :ui="{ body: 'p-8' }">
      <CardHeader />
      <LoginForm />
    </UCard>

    <AuthLoginFooter />
  </div>
</template>

<script lang="ts" setup>
import Branding from "./components/Branding.vue";
import CardHeader from "./components/CardHeader.vue";
import LoginForm from "./components/Form/index.vue";
definePageMeta({ layout: "auth", title: "Login" });
</script>
