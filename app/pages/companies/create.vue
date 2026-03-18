<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Nova empresa
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Preencha as informações da empresa para continuar.
        </p>
      </div>

      <UButton
        variant="outline"
        color="neutral"
        icon="i-lucide-arrow-left"
        label="Voltar"
        @click="navigateTo('/companies')"
      />
    </div>

    <CompanyForm
      ref="formRef"
      title="Nova empresa"
      description="Preencha os dados obrigatórios para continuar."
      submit-label="Criar empresa"
      @submit="handleCreate"
      @cancel="navigateTo('/companies')"
    />
  </div>
</template>

<script lang="ts" setup>
import CompanyForm from "~/components/pages/companies/CompanyForm.vue";
import type { CreateCompanyPayload } from "~/types/company";

definePageMeta({ layout: "default", title: "Nova empresa" });

const { setFlash } = useFlashMessage();

const formRef = ref<InstanceType<typeof CompanyForm>>();

async function handleCreate(payload: CreateCompanyPayload): Promise<void> {
  try {
    await $fetch("/api/companies", {
      method: "POST",
      body: payload,
    });

    setFlash({
      title: "Sucesso",
      description: "Empresa criada com sucesso!",
      color: "success",
    });

    await navigateTo("/companies");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Não foi possível criar a empresa.";
    formRef.value?.showError(message);
  }
}
</script>
