<template>
  <UCard>
    <template #header>
      <div class="space-y-1">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
    </template>

    <form class="space-y-6" @submit.prevent="onSubmit">
      <UFormField label="Nome da empresa" required :error="errors.name">
        <UInput
          v-model="name"
          class="w-full"
          placeholder="Ex.: Zamp Imóveis LTDA"
          icon="i-lucide-briefcase"
          autocomplete="organization"
        />
      </UFormField>

      <UFormField label="CNPJ" required :error="errors.cnpj">
        <UInput
          v-model="cnpj"
          v-maska="'##.###.###/####-##'"
          class="w-full"
          placeholder="00.000.000/0000-00"
          icon="i-lucide-receipt"
          maxlength="18"
        />
      </UFormField>

      <div
        class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-700"
      >
        <UButton
          type="button"
          variant="outline"
          color="neutral"
          :label="cancelLabel"
          @click="emit('cancel')"
        />
        <UButton type="submit" :loading="loading" :label="submitLabel" />
      </div>
    </form>
  </UCard>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { vMaska } from "maska/vue";
import type { CreateCompanyPayload } from "~/types/company";

type CompanyFormValues = CreateCompanyPayload;

const toast = useToast();

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<CompanyFormValues> | null;
    loading?: boolean;
    submitLabel?: string;
    cancelLabel?: string;
    title?: string;
    description?: string;
  }>(),
  {
    initialValues: null,
    loading: false,
    submitLabel: "Salvar",
    cancelLabel: "Cancelar",
    title: "Formulário de empresa",
    description: "Preencha os dados obrigatórios para continuar.",
  },
);

const emit = defineEmits<{
  submit: [payload: CompanyFormValues];
  cancel: [];
}>();

const showError = (message: string) => {
  toast.add({
    title: "Erro",
    description: message,
    color: "error",
  });
};

const showSuccess = (message: string) => {
  toast.add({
    title: "Sucesso",
    description: message,
    color: "success",
  });
};

const onlyDigits = (value: string): string => value.replace(/\D/g, "");

const formatCNPJ = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 14);
  if (!digits) return "";

  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(3, "Informe pelo menos 3 caracteres"),
    cnpj: z
      .string()
      .trim()
      .refine(
        (val) => /^\d{14}$/.test(onlyDigits(val)),
        "CNPJ inválido. Use o formato: 00.000.000/0000-00",
      ),
  }),
);

const { handleSubmit, errors, defineField, resetForm } =
  useForm<CompanyFormValues>({
    validationSchema: schema,
    initialValues: {
      name: props.initialValues?.name ?? "",
      cnpj: formatCNPJ(props.initialValues?.cnpj ?? ""),
    },
  });

const [name] = defineField("name");
const [cnpj] = defineField("cnpj");

watch(
  () => props.initialValues,
  (values) => {
    resetForm({
      values: {
        name: values?.name ?? "",
        cnpj: formatCNPJ(values?.cnpj ?? ""),
      },
    });
  },
  { immediate: true },
);

const onSubmit = handleSubmit((values) => {
  emit("submit", {
    ...values,
    cnpj: onlyDigits(values.cnpj),
  });
});

defineExpose({
  showError,
  showSuccess,
});
</script>
