<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between text-sm">
      <UCheckbox v-model="remember" label="Lembrar de mim" />
      <UButton variant="link" size="sm" class="p-0" to="/auth/forgot-password">
        Esqueceu a senha?
      </UButton>
    </div>

    <UButton
      type="submit"
      color="primary"
      size="lg"
      block
      :loading="loading"
      icon="i-lucide-log-in"
    >
      Entrar
    </UButton>
  </div>
</template>

<script lang="ts" setup>
const remember = defineModel<boolean>("remember", { required: true });
defineProps<{ loading: boolean }>();
</script>
