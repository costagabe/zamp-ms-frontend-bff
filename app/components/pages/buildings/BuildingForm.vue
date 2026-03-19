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
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-4">
          <h3
            class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
          >
            Dados gerais
          </h3>

          <UFormField label="Empresa" required :error="errors.companyId">
            <USelectMenu
              v-model="companyId"
              :items="companyOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione a empresa"
              class="w-full"
              :loading="companiesPending"
            />
          </UFormField>

          <UFormField label="Proprietário" required :error="errors.ownerId">
            <USelectMenu
              v-model="ownerId"
              :items="ownerOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione o proprietário"
              class="w-full"
              :loading="ownersPending"
              searchable
            />
          </UFormField>

          <UFormField label="Status" required :error="errors.status">
            <USelectMenu
              v-model="status"
              :items="statusOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione o status"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Tipo do imóvel"
            required
            :error="errors.propertyType"
          >
            <USelectMenu
              v-model="propertyType"
              :items="propertyTypeOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione o tipo"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Data de captação" :error="errors.capitationDate">
            <UInput v-model="capitationDateModel" type="date" class="w-full" />
          </UFormField>
        </div>

        <div class="space-y-4">
          <h3
            class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
          >
            Características
          </h3>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Área (m²)" :error="errors.area">
              <UInput
                v-model.number="areaModel"
                type="number"
                min="0"
                step="0.01"
              />
            </UFormField>

            <UFormField label="Quartos" :error="errors.bedrooms">
              <UInput v-model.number="bedroomsModel" type="number" min="0" />
            </UFormField>

            <UFormField label="Banheiros" :error="errors.bathrooms">
              <UInput v-model.number="bathroomsModel" type="number" min="0" />
            </UFormField>

            <UFormField label="Vagas" :error="errors.parkingSpaces">
              <UInput
                v-model.number="parkingSpacesModel"
                type="number"
                min="0"
              />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Valor de aluguel" :error="errors.rentValue">
              <UInput
                v-model.number="rentValueModel"
                type="number"
                min="0"
                step="0.01"
                prefix="R$"
              />
            </UFormField>

            <UFormField label="Valor de venda" :error="errors.saleValue">
              <UInput
                v-model.number="saleValueModel"
                type="number"
                min="0"
                step="0.01"
                prefix="R$"
              />
            </UFormField>

            <UFormField label="Condomínio" :error="errors.condominiumFee">
              <UInput
                v-model.number="condominiumFeeModel"
                type="number"
                min="0"
                step="0.01"
                prefix="R$"
              />
            </UFormField>

            <UFormField label="IPTU" :error="errors.iptuValue">
              <UInput
                v-model.number="iptuValueModel"
                type="number"
                min="0"
                step="0.01"
                prefix="R$"
              />
            </UFormField>
          </div>

          <UFormField label="Descrição" :error="errors.description">
            <UTextarea
              v-model="descriptionModel"
              :rows="4"
              placeholder="Descreva características relevantes, acabamentos e diferenciais"
            />
          </UFormField>
        </div>
      </div>

      <div class="space-y-4">
        <h3
          class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          Endereço
        </h3>
        <div class="grid gap-4 md:grid-cols-2">
          <UFormField label="CEP" required :error="addressErrors.cep">
            <UInput v-model.trim="address.cep" placeholder="00000-000" />
          </UFormField>

          <UFormField label="Cidade" required :error="addressErrors.city">
            <UInput v-model.trim="address.city" placeholder="São Paulo" />
          </UFormField>

          <UFormField
            label="Bairro"
            required
            :error="addressErrors.neighbourhood"
          >
            <UInput v-model.trim="address.neighbourhood" placeholder="Centro" />
          </UFormField>

          <UFormField label="Rua" required :error="addressErrors.street">
            <UInput v-model.trim="address.street" placeholder="Av. Paulista" />
          </UFormField>

          <UFormField label="Número" required :error="addressErrors.number">
            <UInput v-model.trim="address.number" placeholder="123" />
          </UFormField>

          <UFormField label="Estado" required :error="addressErrors.state">
            <UInput
              v-model.trim="address.state"
              maxlength="2"
              placeholder="SP"
            />
          </UFormField>

          <UFormField label="Complemento" :error="addressErrors.complement">
            <UInput
              v-model.trim="addressComplementModel"
              placeholder="Apto 12"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Latitude" :error="addressErrors.latitude">
              <UInput
                v-model.number="addressLatitudeModel"
                type="number"
                step="0.000001"
              />
            </UFormField>
            <UFormField label="Longitude" :error="addressErrors.longitude">
              <UInput
                v-model.number="addressLongitudeModel"
                type="number"
                step="0.000001"
              />
            </UFormField>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-700"
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
import { computed } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type {
  BuildingStatus,
  PropertyType,
  CreateBuildingPayload,
  BuildingAddress,
} from "~/types/building";

const toast = useToast();

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<CreateBuildingPayload> | null;
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
    title: "Formulário do imóvel",
    description: "Preencha os dados do imóvel.",
  },
);

const emit = defineEmits<{
  submit: [payload: CreateBuildingPayload];
  cancel: [];
}>();

const statusOptions = [
  { label: "Disponível", value: "AVAILABLE" satisfies BuildingStatus },
  { label: "Alugado", value: "RENTED" satisfies BuildingStatus },
  { label: "Manutenção", value: "MAINTENANCE" satisfies BuildingStatus },
  { label: "Inativo", value: "INACTIVE" satisfies BuildingStatus },
];

const propertyTypeOptions = [
  { label: "Casa", value: "HOUSE" satisfies PropertyType },
  { label: "Apartamento", value: "APARTMENT" satisfies PropertyType },
  { label: "Comercial", value: "COMMERCIAL" satisfies PropertyType },
  { label: "Terreno", value: "LAND" satisfies PropertyType },
  { label: "Fazenda", value: "FARM" satisfies PropertyType },
];

const schema = toTypedSchema(
  z.object({
    companyId: z.string().uuid("Selecione a empresa"),
    ownerId: z.string().uuid("Selecione o proprietário"),
    capitationDate: z.string().optional().nullable(),
    status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE", "INACTIVE"]),
    propertyType: z.enum(["HOUSE", "APARTMENT", "COMMERCIAL", "LAND", "FARM"]),
    area: z.number().nonnegative().optional().nullable(),
    bedrooms: z.number().int().nonnegative().optional().nullable(),
    bathrooms: z.number().int().nonnegative().optional().nullable(),
    parkingSpaces: z.number().int().nonnegative().optional().nullable(),
    description: z.string().optional().nullable(),
    rentValue: z.number().nonnegative().optional().nullable(),
    saleValue: z.number().nonnegative().optional().nullable(),
    condominiumFee: z.number().nonnegative().optional().nullable(),
    iptuValue: z.number().nonnegative().optional().nullable(),
    address: z.object({
      street: z.string().trim().min(1, "Informe a rua"),
      neighbourhood: z.string().trim().min(1, "Informe o bairro"),
      city: z.string().trim().min(1, "Informe a cidade"),
      state: z.string().trim().length(2, "UF inválida"),
      cep: z.string().trim().min(8, "CEP inválido"),
      number: z.string().trim().min(1, "Informe o número"),
      complement: z.string().trim().optional().nullable(),
      latitude: z.number().optional().nullable(),
      longitude: z.number().optional().nullable(),
    }),
    photos: z.array(z.any()).optional(),
  }),
);

const { errors, handleSubmit, defineField, resetForm, setFieldValue } =
  useForm<CreateBuildingPayload>({
    validationSchema: schema,
    initialValues: {
      companyId: props.initialValues?.companyId ?? "",
      ownerId: props.initialValues?.ownerId ?? "",
      capitationDate: props.initialValues?.capitationDate ?? null,
      status: props.initialValues?.status ?? "AVAILABLE",
      propertyType: props.initialValues?.propertyType ?? "HOUSE",
      area: props.initialValues?.area ?? null,
      bedrooms: props.initialValues?.bedrooms ?? null,
      bathrooms: props.initialValues?.bathrooms ?? null,
      parkingSpaces: props.initialValues?.parkingSpaces ?? null,
      description: props.initialValues?.description ?? null,
      rentValue: props.initialValues?.rentValue ?? null,
      saleValue: props.initialValues?.saleValue ?? null,
      condominiumFee: props.initialValues?.condominiumFee ?? null,
      iptuValue: props.initialValues?.iptuValue ?? null,
      address: props.initialValues?.address ?? {
        street: "",
        neighbourhood: "",
        city: "",
        state: "",
        cep: "",
        number: "",
        complement: "",
        latitude: null,
        longitude: null,
      },
      photos: props.initialValues?.photos ?? [],
    },
  });

const [companyId] = defineField("companyId");
const [ownerId] = defineField("ownerId");
const [capitationDate] = defineField("capitationDate");
const [status] = defineField("status");
const [propertyType] = defineField("propertyType");
const [area] = defineField("area");
const [bedrooms] = defineField("bedrooms");
const [bathrooms] = defineField("bathrooms");
const [parkingSpaces] = defineField("parkingSpaces");
const [description] = defineField("description");
const [rentValue] = defineField("rentValue");
const [saleValue] = defineField("saleValue");
const [condominiumFee] = defineField("condominiumFee");
const [iptuValue] = defineField("iptuValue");
const [address] = defineField("address");

const addressErrors = computed<Record<string, string>>(() => {
  const addrErrors = errors.value?.address;
  return addrErrors && typeof addrErrors === "object"
    ? (addrErrors as Record<string, string>)
    : {};
});

const capitationDateModel = computed<string | undefined>({
  get: () => capitationDate.value ?? undefined,
  set: (value) => setFieldValue("capitationDate", value ?? null),
});

const areaModel = computed<number | undefined>({
  get: () => area.value ?? undefined,
  set: (value) => setFieldValue("area", value ?? null),
});

const bedroomsModel = computed<number | undefined>({
  get: () => bedrooms.value ?? undefined,
  set: (value) => setFieldValue("bedrooms", value ?? null),
});

const bathroomsModel = computed<number | undefined>({
  get: () => bathrooms.value ?? undefined,
  set: (value) => setFieldValue("bathrooms", value ?? null),
});

const parkingSpacesModel = computed<number | undefined>({
  get: () => parkingSpaces.value ?? undefined,
  set: (value) => setFieldValue("parkingSpaces", value ?? null),
});

const descriptionModel = computed<string | undefined>({
  get: () => description.value ?? undefined,
  set: (value) => setFieldValue("description", value ?? null),
});

const rentValueModel = computed<number | undefined>({
  get: () => rentValue.value ?? undefined,
  set: (value) => setFieldValue("rentValue", value ?? null),
});

const saleValueModel = computed<number | undefined>({
  get: () => saleValue.value ?? undefined,
  set: (value) => setFieldValue("saleValue", value ?? null),
});

const condominiumFeeModel = computed<number | undefined>({
  get: () => condominiumFee.value ?? undefined,
  set: (value) => setFieldValue("condominiumFee", value ?? null),
});

const iptuValueModel = computed<number | undefined>({
  get: () => iptuValue.value ?? undefined,
  set: (value) => setFieldValue("iptuValue", value ?? null),
});

const addressComplementModel = computed<string | undefined>({
  get: () => address.value?.complement ?? undefined,
  set: (value) => setFieldValue("address.complement", value ?? null),
});

const addressLatitudeModel = computed<number | undefined>({
  get: () => address.value?.latitude ?? undefined,
  set: (value) => setFieldValue("address.latitude", value ?? null),
});

const addressLongitudeModel = computed<number | undefined>({
  get: () => address.value?.longitude ?? undefined,
  set: (value) => setFieldValue("address.longitude", value ?? null),
});

const { data: companiesData, status: companiesStatus } = useAsyncData(
  "companies-for-buildings",
  async () => {
    const result = await $fetch<{ content?: any[] } | any[]>("/api/companies", {
      query: { page: 1, pageSize: 100 },
    });
    if (Array.isArray(result)) return result;
    return result?.content ?? [];
  },
);

const companyOptions = computed(() =>
  (companiesData.value ?? []).map((company: any) => ({
    label: company.name,
    value: company.id,
  })),
);

const companiesPending = computed(() => companiesStatus.value === "pending");

const { data: ownersData, status: ownersStatus } = useAsyncData(
  "clients-for-buildings",
  async () => {
    const result = await $fetch<{ content?: any[] } | any[]>("/api/clients", {
      query: { page: 1, pageSize: 200 },
    });
    if (Array.isArray(result)) return result;
    return result?.content ?? [];
  },
);

const ownerOptions = computed(() =>
  (ownersData.value ?? []).map((client: any) => ({
    label: client.name,
    value: client.id,
  })),
);

const ownersPending = computed(() => ownersStatus.value === "pending");

watch(
  () => props.initialValues,
  (values) => {
    resetForm({
      values: {
        companyId: values?.companyId ?? "",
        ownerId: values?.ownerId ?? "",
        capitationDate: values?.capitationDate ?? null,
        status: values?.status ?? "AVAILABLE",
        propertyType: values?.propertyType ?? "HOUSE",
        area: values?.area ?? null,
        bedrooms: values?.bedrooms ?? null,
        bathrooms: values?.bathrooms ?? null,
        parkingSpaces: values?.parkingSpaces ?? null,
        description: values?.description ?? null,
        rentValue: values?.rentValue ?? null,
        saleValue: values?.saleValue ?? null,
        condominiumFee: values?.condominiumFee ?? null,
        iptuValue: values?.iptuValue ?? null,
        address: values?.address ?? {
          street: "",
          neighbourhood: "",
          city: "",
          state: "",
          cep: "",
          number: "",
          complement: "",
          latitude: null,
          longitude: null,
        },
        photos: values?.photos ?? [],
      },
    });
  },
  { deep: true },
);

const onSubmit = handleSubmit((values) => {
  const sanitizedAddress: BuildingAddress = {
    ...values.address,
    street: values.address.street.trim(),
    neighbourhood: values.address.neighbourhood.trim(),
    city: values.address.city.trim(),
    state: values.address.state.trim().toUpperCase(),
    cep: values.address.cep.trim(),
    number: values.address.number.trim(),
    complement: values.address.complement?.trim() || undefined,
  };

  emit("submit", {
    ...values,
    capitationDate: values.capitationDate || null,
    description: values.description?.trim() || null,
    address: sanitizedAddress,
  });
});

const showError = (message: string) => {
  toast.add({ title: "Erro", description: message, color: "error" });
};

defineExpose({ showError, setFieldValue });
</script>
