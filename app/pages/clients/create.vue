<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Novo cliente
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Cadastre um novo cliente e defina seus dados básicos.
        </p>
      </div>

      <UButton
        variant="outline"
        color="neutral"
        icon="i-lucide-arrow-left"
        label="Voltar"
        @click="navigateTo('/clients')"
      />
    </div>

    <ClientForm
      ref="formRef"
      :loading="loading"
      title="Criar cliente"
      description="Separe os dados pessoais e do endereço."
      submit-label="Criar cliente"
      @submit="handleCreate"
      @cancel="() => navigateTo('/clients')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { CreateClientPayload } from "~/types/client";
import ClientForm from "~/components/pages/clients/ClientForm.vue";

definePageMeta({ layout: "default", title: "Novo cliente" });

const store = useClientsStore();
const { setFlash } = useFlashMessage();

const formRef = ref<InstanceType<typeof ClientForm>>();
const loading = ref(false);
const error = ref<string | null>(null);

async function handleCreate(payload: CreateClientPayload) {
  loading.value = true;
  error.value = null;

  try {
    await store.create(payload);
    setFlash({
      title: "Sucesso",
      description: "Cliente criado com sucesso!",
      color: "success",
    });
    await navigateTo("/clients");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Não foi possível criar o cliente.";
    error.value = message;
    formRef.value?.showError(message);
  } finally {
    loading.value = false;
  }
}
</script>
