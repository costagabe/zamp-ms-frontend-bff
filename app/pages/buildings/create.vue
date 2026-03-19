<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Novo imóvel
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Cadastre um novo imóvel e informe endereço e características.
        </p>
      </div>

      <UButton
        variant="outline"
        color="neutral"
        icon="i-lucide-arrow-left"
        label="Voltar"
        @click="navigateTo('/buildings')"
      />
    </div>

    <BuildingForm
      ref="formRef"
      title="Criar imóvel"
      description="Preencha os dados obrigatórios para continuar."
      submit-label="Criar imóvel"
      :loading="loading"
      @submit="handleCreate"
      @cancel="navigateTo('/buildings')"
    />
  </div>
</template>

<script lang="ts" setup>
import BuildingForm from "~/components/pages/buildings/BuildingForm.vue";
import type { CreateBuildingPayload } from "~/types/building";

definePageMeta({ layout: "default", title: "Novo imóvel" });

const { setFlash } = useFlashMessage();
const store = useBuildingsStore();

const formRef = ref<InstanceType<typeof BuildingForm>>();
const loading = ref(false);
const error = ref<string | null>(null);

async function handleCreate(payload: CreateBuildingPayload) {
  loading.value = true;
  error.value = null;

  try {
    await store.create(payload);
    setFlash({
      title: "Sucesso",
      description: "Imóvel criado com sucesso!",
      color: "success",
    });
    await navigateTo("/buildings");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Não foi possível criar o imóvel.";
    error.value = message;
    formRef.value?.showError(message);
  } finally {
    loading.value = false;
  }
}
</script>
