<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Editar empresa
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Atualize as informações da empresa.
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

    <div v-if="!company" class="py-10 text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="mx-auto h-6 w-6 animate-spin text-gray-400"
      />
    </div>

    <CompanyForm
      v-else
      ref="formRef"
      :loading="saving"
      :initial-values="formValues"
      title="Atualizar empresa"
      description="Mantenha as informações da empresa atualizadas."
      submit-label="Salvar alterações"
      @submit="handleUpdate"
      @cancel="navigateTo('/companies')"
    />
  </div>
</template>

<script lang="ts" setup>
import CompanyForm from "~/components/pages/companies/CompanyForm.vue";
import type { CreateCompanyPayload, Company } from "~/types/company";

definePageMeta({ layout: "default" });

const route = useRoute();
const { setFlash } = useFlashMessage();

const formRef = ref<InstanceType<typeof CompanyForm>>();
const companyId = route.params.id as string;
const saving = ref<boolean>(false);

const { data: company } = await useFetch<Company>(
  `/api/companies/${companyId}`,
);

const formValues = computed((): Partial<CreateCompanyPayload> | null => {
  if (!company.value) return null;
  return {
    name: company.value.name,
    cnpj: company.value.cnpj,
  };
});

async function handleUpdate(payload: CreateCompanyPayload): Promise<void> {
  saving.value = true;

  try {
    await $fetch(`/api/companies/${companyId}`, {
      method: "PUT",
      body: payload,
    });

    setFlash({
      title: "Sucesso",
      description: "Empresa atualizada com sucesso!",
      color: "success",
    });

    await navigateTo("/companies");
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível atualizar a empresa.";
    formRef.value?.showError(message);
  } finally {
    saving.value = false;
  }
}
</script>
