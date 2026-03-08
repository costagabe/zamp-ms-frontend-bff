<template>
  <div>
    <UAlert
      v-if="errorMessage"
      color="error"
      variant="soft"
      icon="i-lucide-circle-alert"
      :description="errorMessage"
      class="mb-5"
    />

    <form @submit.prevent="handleLogin" class="space-y-5">
      <FormFields
        v-model:email="form.email"
        v-model:password="form.password"
        :show-password="showPassword"
        @toggle-password="showPassword = !showPassword"
      />
      <FormActions v-model:remember="form.remember" :loading="loading" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import FormFields from "./components/FormFields.vue";
import FormActions from "./components/FormActions.vue";
import { useLoginForm } from "../../composables/useLoginForm";

const { form, loading, showPassword, errorMessage, handleLogin } =
  useLoginForm();
</script>
