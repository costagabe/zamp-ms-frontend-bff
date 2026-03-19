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

    <form class="space-y-8" @submit.prevent="onSubmit">
      <div class="space-y-4">
        <h3
          class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          Dados do cliente
        </h3>
        <div class="grid gap-4 md:grid-cols-2">
          <UFormField label="Empresa" required :error="errors.companyId">
            <USelectMenu
              v-model="companyId"
              :items="companyOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione a empresa"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Nome completo" required :error="errors.name">
            <UInput
              v-model="name"
              placeholder="Ex.: Maria da Silva"
              class="w-full"
              autocomplete="name"
            />
          </UFormField>

          <UFormField label="E-mail" :error="errors.email">
            <UInput
              v-model.trim="email"
              placeholder="email@cliente.com"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Telefone" :error="errors.phone">
            <UInput
              v-model.trim="phone"
              v-maska="'(##) #####-####'"
              placeholder="(11) 99999-9999"
              class="w-full"
              maxlength="15"
            />
          </UFormField>

          <UFormField
            label="Tipo de pessoa"
            required
            :error="errors.personType"
          >
            <USelectMenu
              v-model="personType"
              :items="personTypeOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione o tipo"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Tipos de cliente"
            required
            :error="errors.clientTypes"
          >
            <USelectMenu
              v-model="clientTypes"
              :items="clientTypeOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione os tipos"
              class="w-full"
              multiple
            />
          </UFormField>

          <UFormField
            v-if="personType === 'PF'"
            label="CPF"
            :error="errors.cpf"
          >
            <UInput
              v-model.trim="cpf"
              v-maska="'###.###.###-##'"
              placeholder="000.000.000-00"
              class="w-full"
              maxlength="14"
            />
          </UFormField>

          <UFormField v-else label="CNPJ" :error="errors.cnpj">
            <UInput
              v-model.trim="cnpj"
              placeholder="00.000.000/0000-00"
              class="w-full"
            />
          </UFormField>

          <UFormField label="RG" :error="errors.rg">
            <UInput
              v-model.trim="rg"
              placeholder="Documento de identificação"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Profissão" :error="errors.profession">
            <UInput
              v-model.trim="profession"
              placeholder="Ex.: Engenheira"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Renda mensal" :error="errors.monthlyIncome">
            <UInput
              v-model="monthlyIncome"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex.: 5000"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Data de nascimento" :error="errors.birthDate">
            <UInput v-model="birthDate" type="date" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Observações" :error="errors.notes">
          <UTextarea
            v-model="notes"
            :rows="4"
            placeholder="Observações ou anotações adicionais"
            class="w-full"
          />
        </UFormField>
      </div>

      <div class="space-y-4">
        <h3
          class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          Endereço
        </h3>
        <div class="grid gap-4 md:grid-cols-2">
          <UFormField label="CEP" :error="errors['address.cep']">
            <UInput
              v-model.trim="addressCep"
              v-maska="'#####-###'"
              placeholder="00000-000"
              class="w-full"
              maxlength="9"
            />
          </UFormField>
          <UFormField label="Tipo" :error="errors['address.type']">
            <USelectMenu
              v-model="addressType"
              :items="addressTypeOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Rua" :error="errors['address.street']">
            <UInput
              v-model.trim="addressStreet"
              placeholder="Av. Paulista"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Número" :error="errors['address.number']">
            <UInput
              v-model.trim="addressNumber"
              placeholder="123"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Bairro" :error="errors['address.neighbourhood']">
            <UInput
              v-model.trim="addressNeighbourhood"
              placeholder="Centro"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Estado" :error="errors['address.state']">
            <USelectMenu
              v-model="addressState"
              :items="stateOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione o estado"
              class="w-full"
              :loading="loadingStates"
            />
          </UFormField>
          <UFormField label="Cidade" :error="errors['address.city']">
            <USelectMenu
              v-model="addressCity"
              v-model:searchTerm="citySearchTerm"
              :items="filteredCityOptions"
              value-key="nome"
              label-key="nome"
              placeholder="Selecione a cidade"
              class="w-full"
              :disabled="!addressState"
              :loading="loadingCities"
              :search-input="{ placeholder: 'Buscar cidade' }"
            />
          </UFormField>
          <UFormField label="Complemento" :error="errors['address.complement']">
            <UInput
              v-model.trim="addressComplement"
              placeholder="Apto 12"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

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
import type {
  AddressType,
  ClientAddress,
  ClientType,
  CreateClientPayload,
  PersonType,
} from "~/types/client";

const PERSON_TYPE_OPTIONS = [
  { label: "Pessoa física", value: "PF" },
  { label: "Pessoa jurídica", value: "PJ" },
] as const;

const CLIENT_TYPE_OPTIONS = [
  { label: "Inquilino", value: "LESSEE" },
  { label: "Proprietário", value: "LESSOR" },
] as const;

const ADDRESS_TYPE_OPTIONS = [
  { label: "Residencial", value: "RESIDENTIAL" },
  { label: "Comercial", value: "COMMERCIAL" },
  { label: "Outro", value: "OTHER" },
];

type ClientFormValues = {
  companyId: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  rg?: string;
  personType: PersonType;
  birthDate?: string;
  profession?: string;
  monthlyIncome?: number;
  notes?: string;
  clientTypes: ClientType[];
  address?: ClientAddress;
};

type IbgeState = {
  id: number;
  sigla: string;
  nome: string;
};

type IbgeCity = {
  id: number;
  nome: string;
};

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<ClientFormValues> | null;
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
    title: "Formulário de cliente",
    description: "Preencha os dados do cliente e endereço.",
  },
);

const emit = defineEmits<{
  submit: [payload: CreateClientPayload];
  cancel: [];
}>();

const toast = useToast();
const companyStore = useCompanyStore();
companyStore.hydrateFromStorage();

const { data: companiesData } = await useFetch<
  Array<{ id: string; name: string }>
>("/api/companies/my", {
  default: () => [],
});

const companyOptions = computed(() =>
  (companiesData.value ?? []).map((company) => ({
    label: company.name,
    value: company.id,
  })),
);

const personTypeOptions = [...PERSON_TYPE_OPTIONS];
const clientTypeOptions = [...CLIENT_TYPE_OPTIONS];
const addressTypeOptions = [...ADDRESS_TYPE_OPTIONS];

const { data: statesData, pending: loadingStates } = await useFetch<
  IbgeState[]
>("https://servicodados.ibge.gov.br/api/v1/localidades/estados", {
  query: { orderBy: "nome" },
  default: () => [],
});

const stateOptions = computed(() =>
  (statesData.value ?? []).map((state) => ({
    label: `${state.nome} (${state.sigla})`,
    value: state.sigla,
  })),
);

const cities = ref<IbgeCity[]>([]);
const loadingCities = ref(false);
const citySearchTerm = ref("");
const debouncedCitySearch = ref("");
let citySearchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const filteredCityOptions = computed(() => {
  const term = debouncedCitySearch.value.trim().toLocaleLowerCase("pt-BR");
  if (!term) return cities.value.slice(0, 200);

  return cities.value
    .filter((city) => city.nome.toLocaleLowerCase("pt-BR").includes(term))
    .slice(0, 200);
});

const onlyDigits = (value?: string | null): string =>
  (value ?? "").replace(/\D/g, "");

const formatCPF = (value?: string | null): string => {
  const digits = onlyDigits(value).slice(0, 11);
  if (!digits) return "";

  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatPhone = (value?: string | null): string => {
  const digits = onlyDigits(value).slice(0, 11);
  if (!digits) return "";

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
};

const formatCEP = (value?: string | null): string => {
  const digits = onlyDigits(value).slice(0, 8);
  if (!digits) return "";

  return digits.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
};

const normalizeAddressForForm = (
  address?: ClientAddress | null,
): ClientAddress => ({
  ...(address ?? {}),
  cep: formatCEP(address?.cep) || undefined,
  street: address?.street ?? undefined,
  neighbourhood: address?.neighbourhood ?? undefined,
  city: address?.city ?? undefined,
  state: address?.state ?? undefined,
  number: address?.number ?? undefined,
  complement: address?.complement ?? undefined,
  type: address?.type ?? undefined,
});

const schema = toTypedSchema(
  z
    .object({
      companyId: z.string().uuid("Selecione uma empresa"),
      name: z.string().trim().min(3, "Informe pelo menos 3 caracteres"),
      email: z
        .string()
        .trim()
        .email("E-mail inválido")
        .optional()
        .or(z.literal("").transform(() => undefined)),
      phone: z
        .string()
        .trim()
        .optional()
        .or(z.literal("").transform(() => undefined)),
      cpf: z
        .string()
        .trim()
        .optional()
        .or(z.literal("").transform(() => undefined)),
      cnpj: z
        .string()
        .trim()
        .optional()
        .or(z.literal("").transform(() => undefined)),
      rg: z
        .string()
        .trim()
        .optional()
        .or(z.literal("").transform(() => undefined)),
      personType: z.enum(["PF", "PJ"]),
      birthDate: z
        .string()
        .optional()
        .or(z.literal("").transform(() => undefined)),
      profession: z
        .string()
        .trim()
        .optional()
        .or(z.literal("").transform(() => undefined)),
      monthlyIncome: z.preprocess((value) => {
        if (value === "" || value === null || value === undefined) return null;
        const num = Number(value);
        return Number.isNaN(num) ? value : num;
      }, z.number().nonnegative().nullable()),
      notes: z
        .string()
        .trim()
        .optional()
        .or(z.literal("").transform(() => undefined)),
      clientTypes: z
        .array(z.string())
        .min(1, "Selecione ao menos um tipo de cliente"),
      address: z
        .object({
          street: z
            .string()
            .optional()
            .or(z.literal("").transform(() => undefined)),
          neighbourhood: z
            .string()
            .optional()
            .or(z.literal("").transform(() => undefined)),
          city: z
            .string()
            .optional()
            .or(z.literal("").transform(() => undefined)),
          state: z
            .string()
            .optional()
            .or(z.literal("").transform(() => undefined)),
          cep: z
            .string()
            .optional()
            .or(z.literal("").transform(() => undefined)),
          number: z
            .string()
            .optional()
            .or(z.literal("").transform(() => undefined)),
          complement: z
            .string()
            .optional()
            .or(z.literal("").transform(() => undefined)),
          type: z
            .string()
            .optional()
            .or(z.literal("").transform(() => undefined)),
        })
        .optional(),
    })
    .superRefine((values, ctx) => {
      if (values.personType === "PF" && !values.cpf) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CPF é obrigatório para pessoa física",
          path: ["cpf"],
        });
      }
      if (values.personType === "PJ" && !values.cnpj) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CNPJ é obrigatório para pessoa jurídica",
          path: ["cnpj"],
        });
      }
    }),
);

const { handleSubmit, errors, defineField, resetForm } = useForm<
  ClientFormValues & { address?: ClientAddress }
>({
  validationSchema: schema,
  initialValues: {
    companyId:
      props.initialValues?.companyId ?? companyStore.currentCompany ?? "",
    name: props.initialValues?.name ?? "",
    email: props.initialValues?.email ?? undefined,
    phone: formatPhone(props.initialValues?.phone) || undefined,
    cpf: formatCPF(props.initialValues?.cpf) || undefined,
    cnpj: props.initialValues?.cnpj ?? undefined,
    rg: props.initialValues?.rg ?? undefined,
    personType: props.initialValues?.personType ?? "PF",
    birthDate: props.initialValues?.birthDate ?? undefined,
    profession: props.initialValues?.profession ?? undefined,
    monthlyIncome: props.initialValues?.monthlyIncome ?? undefined,
    notes: props.initialValues?.notes ?? undefined,
    clientTypes: props.initialValues?.clientTypes ?? [],
    address: normalizeAddressForForm(props.initialValues?.address),
  },
});

const [companyId] = defineField("companyId");
const [name] = defineField("name");
const [email] = defineField("email");
const [phone] = defineField("phone");
const [cpf] = defineField("cpf");
const [cnpj] = defineField("cnpj");
const [rg] = defineField("rg");
const [personType] = defineField("personType");
const [birthDate] = defineField("birthDate");
const [profession] = defineField("profession");
const [monthlyIncome] = defineField("monthlyIncome");
const [notes] = defineField("notes");
const [clientTypes] = defineField("clientTypes");

const addressModel = ref<ClientAddress>(
  normalizeAddressForForm(props.initialValues?.address),
);

const addressCep = computed({
  get: () => addressModel.value.cep ?? "",
  set: (value: string) => (addressModel.value.cep = value || undefined),
});
const addressType = computed({
  get: () => addressModel.value.type ?? "",
  set: (value: string) =>
    (addressModel.value.type = (value as AddressType) || undefined),
});
const addressStreet = computed({
  get: () => addressModel.value.street ?? "",
  set: (value: string) => (addressModel.value.street = value || undefined),
});
const addressNumber = computed({
  get: () => addressModel.value.number ?? "",
  set: (value: string) => (addressModel.value.number = value || undefined),
});
const addressNeighbourhood = computed({
  get: () => addressModel.value.neighbourhood ?? "",
  set: (value: string) =>
    (addressModel.value.neighbourhood = value || undefined),
});
const addressCity = computed({
  get: () => addressModel.value.city ?? "",
  set: (value: string) => (addressModel.value.city = value || undefined),
});
const addressState = computed({
  get: () => addressModel.value.state ?? "",
  set: (value: string) => (addressModel.value.state = value || undefined),
});
const addressComplement = computed({
  get: () => addressModel.value.complement ?? "",
  set: (value: string) => (addressModel.value.complement = value || undefined),
});

const loadCitiesByState = async (uf?: string) => {
  if (!uf) {
    cities.value = [];
    return;
  }

  loadingCities.value = true;

  try {
    const data = await $fetch<IbgeCity[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
    );
    cities.value = data ?? [];
  } catch {
    cities.value = [];
  } finally {
    loadingCities.value = false;
  }
};

watch(personType, (value) => {
  if (value === "PF") {
    cnpj.value = "" as any;
  } else {
    cpf.value = "" as any;
  }
});

watch(citySearchTerm, (value) => {
  if (citySearchDebounceTimer) {
    clearTimeout(citySearchDebounceTimer);
  }

  citySearchDebounceTimer = setTimeout(() => {
    debouncedCitySearch.value = value ?? "";
  }, 300);
});

watch(
  addressState,
  async (newState, oldState) => {
    await loadCitiesByState(newState);
    citySearchTerm.value = "";
    debouncedCitySearch.value = "";

    if (!newState) {
      addressCity.value = "";
      return;
    }

    if (oldState !== newState) {
      const selectedCity = addressCity.value;
      const hasSelectedCity = cities.value.some(
        (city) => city.nome === selectedCity,
      );

      if (!hasSelectedCity) {
        addressCity.value = "";
      }
    }
  },
  { immediate: true },
);

watch(
  () => props.initialValues,
  (values) => {
    resetForm({
      values: {
        companyId: values?.companyId ?? companyStore.currentCompany ?? "",
        name: values?.name ?? "",
        email: values?.email ?? undefined,
        phone: formatPhone(values?.phone) || undefined,
        cpf: formatCPF(values?.cpf) || undefined,
        cnpj: values?.cnpj ?? undefined,
        rg: values?.rg ?? undefined,
        personType: values?.personType ?? "PF",
        birthDate: values?.birthDate ?? undefined,
        profession: values?.profession ?? undefined,
        monthlyIncome: values?.monthlyIncome ?? undefined,
        notes: values?.notes ?? undefined,
        clientTypes: values?.clientTypes ?? [],
        address: normalizeAddressForForm(values?.address),
      },
    });
    addressModel.value = normalizeAddressForForm(values?.address);
  },
  { immediate: true },
);

const onSubmit = handleSubmit((values) => {
  const addressPayload = {
    ...addressModel.value,
    cep: onlyDigits(addressModel.value.cep) || undefined,
  };
  const hasAddress = Object.values(addressPayload).some((v) => Boolean(v));

  const payload: CreateClientPayload = {
    companyId: values.companyId,
    name: values.name,
    email: values.email ?? null,
    phone: onlyDigits(values.phone) || null,
    cpf: values.personType === "PF" ? onlyDigits(values.cpf) || null : null,
    cnpj: values.personType === "PJ" ? onlyDigits(values.cnpj) || null : null,
    rg: values.rg ?? null,
    personType: values.personType,
    birthDate: values.birthDate ?? null,
    profession: values.profession ?? null,
    monthlyIncome: values.monthlyIncome ?? null,
    notes: values.notes ?? null,
    clientTypes: values.clientTypes as ClientFormValues["clientTypes"],
    address: hasAddress ? { ...addressPayload } : null,
  };

  emit("submit", payload);
});

const showError = (message: string) => {
  toast.add({ title: "Erro", description: message, color: "error" });
};

const showSuccess = (message: string) => {
  toast.add({ title: "Sucesso", description: message, color: "success" });
};

defineExpose({ showError, showSuccess });
</script>
