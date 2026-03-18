<template>
  <div class="space-y-5">
    <UFormField label="E-mail" name="email" required :error="errors?.email">
      <UInput
        v-model.trim="email"
        placeholder="seu@email.com"
        icon="i-lucide-mail"
        size="lg"
        class="w-full"
        autocomplete="email"
      />
    </UFormField>

    <UFormField
      label="Senha"
      name="password"
      required
      :error="errors?.password"
    >
      <UInput
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="••••••••"
        icon="i-lucide-lock"
        size="lg"
        class="w-full"
        autocomplete="current-password"
        :trailing-icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        @click-trailing="emit('toggle-password')"
      />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
const [email, emailModifiers] = defineModel<string, "trim">("email", {
  required: true,
  set(value) {
    return emailModifiers.trim ? value.trim() : value;
  },
});
const password = defineModel<string>("password", { required: true });

defineProps<{
  showPassword: boolean;
  errors?: {
    email?: string;
    password?: string;
  };
}>();
const emit = defineEmits<{ "toggle-password": [] }>();
</script>
