<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Editar cliente
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Atualize os dados pessoais e de endereço do cliente.
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

    <div v-if="!client" class="py-10 text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="mx-auto h-6 w-6 animate-spin text-gray-400"
      />
    </div>

    <ClientForm
      v-else
      ref="formRef"
      :loading="saving"
      :initial-values="formValues"
      title="Atualizar cliente"
      description="Revise os dados antes de salvar."
      submit-label="Salvar alterações"
      @submit="handleUpdate"
      @cancel="navigateTo('/clients')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { CreateClientPayload, Client } from "~/types/client";
import ClientForm from "~/components/pages/clients/ClientForm.vue";

definePageMeta({ layout: "default", title: "Editar cliente" });

const route = useRoute();
const store = useClientsStore();
const { setFlash } = useFlashMessage();

const clientId = route.params.id as string;
const saving = ref(false);
const error = ref<string | null>(null);
const formRef = ref<InstanceType<typeof ClientForm>>();

const { data: client } = await useFetch<Client>(`/api/clients/${clientId}`);

const formValues = computed((): Partial<CreateClientPayload> | null => {
  if (!client.value) return null;
  return {
    companyId: client.value.companyId,
    name: client.value.name,
    email: client.value.email ?? undefined,
    phone: client.value.phone ?? undefined,
    cpf: client.value.cpf ?? undefined,
    cnpj: client.value.cnpj ?? undefined,
    rg: client.value.rg ?? undefined,
    personType: client.value.personType,
    birthDate: client.value.birthDate ?? undefined,
    profession: client.value.profession ?? undefined,
    monthlyIncome: client.value.monthlyIncome ?? undefined,
    notes: client.value.notes ?? undefined,
    clientTypes: client.value.clientTypes,
    address: client.value.address ?? undefined,
  };
});

async function handleUpdate(payload: CreateClientPayload): Promise<void> {
  saving.value = true;
  error.value = null;

  try {
    await store.update(clientId, payload);
    setFlash({
      title: "Sucesso",
      description: "Cliente atualizado com sucesso!",
      color: "success",
    });
    await navigateTo("/clients");
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível atualizar o cliente.";
    error.value = message;
    formRef.value?.showError(message);
  } finally {
    saving.value = false;
  }
}
</script>
