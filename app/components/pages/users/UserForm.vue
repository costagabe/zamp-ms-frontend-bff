<template>
  <UCard>
    <template #header>
      <div
        class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
      >
        <div class="space-y-1">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ description }}
          </p>
        </div>
        <UButton
          v-if="isDevFillButtonVisible"
          size="xs"
          variant="outline"
          color="neutral"
          icon="i-lucide-wand"
          label="Preencher automático"
          @click="fillUser()"
        />
      </div>
    </template>

    <form class="space-y-6" @submit.prevent="onSubmit">
      <UFormField label="Nome completo" required :error="errors.name">
        <UInput
          v-model="name"
          class="w-full"
          placeholder="Ex.: Maria da Silva"
          icon="i-lucide-user"
          autocomplete="name"
        />
      </UFormField>

      <UFormField label="E-mail" required :error="errors.email">
        <UInput
          v-model.trim="email"
          class="w-full"
          placeholder="email@empresa.com"
          icon="i-lucide-mail"
          autocomplete="email"
        />
      </UFormField>
      <UFormField label="Papel" required :error="errors.role">
        <USelectMenu
          v-model="role"
          :items="roleOptions"
          value-key="value"
          label-key="label"
          placeholder="Selecione um papel"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Empresas" required :error="errors.companies">
        <USelectMenu
          v-model="companies"
          :items="companyOptions"
          value-key="value"
          label-key="label"
          placeholder="Selecione as empresas"
          class="w-full"
          multiple
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
import type { CreateUserPayload } from "~/types/user";
import { useRoles } from "~/composables/roles/useRoles";
import { useFillForm } from "~/composables/useFillForm";

type UserFormValues = CreateUserPayload;

const toast = useToast();

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<UserFormValues> | null;
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
    title: "Formulário de usuário",
    description: "Preencha os dados obrigatórios para continuar.",
  },
);

const emit = defineEmits<{
  submit: [payload: UserFormValues];
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

const { roles } = useRoles();

const roleOptions = computed(() =>
  roles.value.map((role) => ({
    label: role.name,
    value: role.id,
  })),
);

interface Company {
  id: string;
  name: string;
  cnpj: string;
}

const { data: companiesData } = await useFetch<Company[]>("/api/companies/my");

const companyOptions = computed(() =>
  (companiesData.value ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  })),
);

const { isDevFillButtonVisible, fillUserForm } = useFillForm();

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(3, "Informe pelo menos 3 caracteres"),
    email: z.string().trim(),
    role: z.string().uuid("Selecione um papel válido"),
    companies: z
      .array(z.string().uuid())
      .min(1, "Selecione ao menos uma empresa"),
  }),
);

const { handleSubmit, errors, defineField, resetForm, setFieldValue } =
  useForm<UserFormValues>({
    validationSchema: schema,
    initialValues: {
      name: props.initialValues?.name ?? "",
      email: props.initialValues?.email ?? "",
      role: props.initialValues?.role ?? "",
      companies: props.initialValues?.companies ?? [],
    },
  });

const [name] = defineField("name");
const [email] = defineField("email");
const [role] = defineField("role");
const [companies] = defineField("companies");

function fillUser() {
  fillUserForm({
    setFieldValue,
    roleOptions: roleOptions.value,
    companyOptions: companyOptions.value,
  });
}

watch(
  () => props.initialValues,
  (values) => {
    resetForm({
      values: {
        name: values?.name ?? "",
        email: values?.email ?? "",
        role: values?.role ?? "",
        companies: values?.companies ?? [],
      },
    });
  },
  { immediate: true },
);

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});

defineExpose({
  showError,
  showSuccess,
});
</script>
