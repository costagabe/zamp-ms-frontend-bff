<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Editar imóvel
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Atualize os dados do imóvel antes de salvar.
        </p>
      </div>

      <UButton
        variant="outline"
        color="neutral"
        icon="i-lucide-arrow-left"
        label="Voltar"
        @click="navigateTo(`/buildings/${id}`)"
      />
    </div>

    <div v-if="pending" class="py-10 text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="mx-auto h-6 w-6 animate-spin text-gray-400"
      />
    </div>

    <BuildingForm
      v-else-if="building"
      ref="formRef"
      :initial-values="building"
      title="Atualizar imóvel"
      description="Revise os dados do imóvel antes de salvar."
      submit-label="Salvar alterações"
      :loading="saving"
      @submit="handleUpdate"
      @cancel="() => navigateTo(`/buildings/${id}`)"
    />

    <UAlert
      v-else
      color="error"
      title="Erro"
      description="Imóvel não encontrado."
    />
  </div>
</template>

<script lang="ts" setup>
import BuildingForm from "~/components/pages/buildings/BuildingForm.vue";
import type { CreateBuildingPayload, Building } from "~/types/building";

definePageMeta({ layout: "default", title: "Editar imóvel" });

const route = useRoute();
const id = route.params.id as string;

const { setFlash } = useFlashMessage();
const store = useBuildingsStore();

const formRef = ref<InstanceType<typeof BuildingForm>>();
const saving = ref(false);
const error = ref<string | null>(null);

const { data: building, status } = await useFetch<Building>(
  `/api/buildings/${id}`,
);

const pending = computed(() => status.value === "pending");

async function handleUpdate(payload: CreateBuildingPayload) {
  saving.value = true;
  error.value = null;

  try {
    await store.update(id, payload);
    setFlash({
      title: "Sucesso",
      description: "Imóvel atualizado com sucesso!",
      color: "success",
    });
    await navigateTo(`/buildings/${id}`);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível atualizar o imóvel.";
    error.value = message;
    formRef.value?.showError(message);
  } finally {
    saving.value = false;
  }
}
</script>
