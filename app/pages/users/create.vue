<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Novo usuário
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Cadastre um novo usuário para acesso ao sistema.
        </p>
      </div>

      <UButton
        variant="outline"
        color="neutral"
        icon="i-lucide-arrow-left"
        label="Voltar"
        @click="navigateTo('/users')"
      />
    </div>

    <UserForm
      ref="formRef"
      :loading="loading"
      title="Criar usuário"
      description="Defina as permissões iniciais do novo usuário."
      submit-label="Criar usuário"
      @submit="handleCreate"
      @cancel="() => navigateTo('/users')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { CreateUserPayload } from "~/types/user";
import UserForm from "~/components/pages/users/UserForm.vue";

definePageMeta({ layout: "default" });

const store = useUsersStore();
const { setFlash } = useFlashMessage();

const formRef = ref<InstanceType<typeof UserForm>>();
const loading = ref(false);
const error = ref<string | null>(null);

async function handleCreate(payload: CreateUserPayload) {
  loading.value = true;
  error.value = null;

  try {
    await store.create(payload);
    setFlash({
      title: "Sucesso",
      description: "Usuário criado com sucesso!",
      color: "success",
    });
    await navigateTo("/users");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Não foi possível criar o usuário.";
    error.value = message;
    formRef.value?.showError(message);
  } finally {
    loading.value = false;
  }
}
</script>
