<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Detalhes do imóvel
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Consulte informações principais, fotos e documentos.
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <UButton
          variant="outline"
          color="neutral"
          icon="i-lucide-arrow-left"
          label="Voltar"
          @click="navigateTo('/buildings')"
        />
        <UButton
          icon="i-lucide-pencil"
          label="Editar"
          @click="navigateTo(`/buildings/${id}/edit`)"
        />
        <UButton
          variant="outline"
          icon="i-lucide-images"
          label="Gerenciar fotos"
          @click="navigateTo(`/buildings/${id}/photos`)"
        />
        <UButton
          variant="outline"
          icon="i-lucide-file-text"
          label="Documentos"
          @click="navigateTo(`/buildings/${id}/documents`)"
        />
      </div>
    </div>

    <div v-if="pending" class="py-12 text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="mx-auto h-6 w-6 animate-spin text-gray-400"
      />
    </div>

    <template v-else-if="building">
      <UTabs v-model="tab" :items="tabs">
        <template #item.info>
          <div class="grid gap-4 lg:grid-cols-3">
            <UCard class="lg:col-span-2">
              <template #header>
                <div class="flex items-center justify-between">
                  <div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      Informações básicas
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Status, tipo e valores
                    </p>
                  </div>
                  <UBadge
                    :class="statusBadgeClass(building.status)"
                    variant="soft"
                  >
                    {{ statusLabel(building.status) }}
                  </UBadge>
                </div>
              </template>

              <dl class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <dt class="text-xs uppercase tracking-wide text-gray-500">
                    Tipo
                  </dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ propertyTypeLabel(building.propertyType) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-wide text-gray-500">
                    Área
                  </dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ building.area ?? "-" }} m²
                  </dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-wide text-gray-500">
                    Quartos
                  </dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ building.bedrooms ?? "-" }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-wide text-gray-500">
                    Banheiros
                  </dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ building.bathrooms ?? "-" }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-wide text-gray-500">
                    Vagas
                  </dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ building.parkingSpaces ?? "-" }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-wide text-gray-500">
                    Captação
                  </dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ building.capitationDate || "-" }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-wide text-gray-500">
                    Valor aluguel
                  </dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(building.rentValue) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs uppercase tracking-wide text-gray-500">
                    Valor venda
                  </dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(building.saleValue) }}
                  </dd>
                </div>
              </dl>

              <div class="mt-4">
                <dt class="text-xs uppercase tracking-wide text-gray-500">
                  Descrição
                </dt>
                <dd class="text-sm text-gray-800 dark:text-gray-100">
                  {{ building.description || "-" }}
                </dd>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Endereço
                </h3>
              </template>
              <p class="text-sm text-gray-800 dark:text-gray-100">
                {{ formatAddress(building.address) }}
              </p>
              <p class="text-xs text-gray-500">
                CEP {{ building.address.cep }}
              </p>
              <div
                class="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400"
              >
                <div>Latitude: {{ building.address.latitude ?? "-" }}</div>
                <div>Longitude: {{ building.address.longitude ?? "-" }}</div>
              </div>
            </UCard>
          </div>
        </template>

        <template #item.photos>
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Fotos
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Acesse a página dedicada para gerenciar fotos e recortes.
                  </p>
                </div>
                <UButton
                  icon="i-lucide-images"
                  label="Abrir gestão de fotos"
                  @click="navigateTo(`/buildings/${id}/photos`)"
                />
              </div>
            </template>

            <div class="grid gap-4 md:grid-cols-3">
              <div
                v-for="photo in building.photos ?? []"
                :key="photo.id"
                class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <img
                  v-if="photo.publicPath"
                  :src="photo.publicPath"
                  :alt="photo.filename"
                  class="h-40 w-full object-cover"
                />
                <div class="p-2 text-xs text-gray-600 dark:text-gray-300">
                  {{ photo.filename || photo.id }}
                </div>
              </div>
              <p
                v-if="!building.photos || building.photos.length === 0"
                class="text-sm text-gray-600"
              >
                Nenhuma foto carregada. Use o botão acima para adicionar.
              </p>
            </div>
          </UCard>
        </template>

        <template #item.documents>
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Documentos
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Consulte e baixe os arquivos.
                  </p>
                </div>
                <UButton
                  variant="outline"
                  icon="i-lucide-file-text"
                  label="Gerenciar"
                  @click="navigateTo(`/buildings/${id}/documents`)"
                />
              </div>
            </template>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Abra a aba de documentos para visualizar os arquivos disponíveis.
            </p>
          </UCard>
        </template>

        <template #item.visits>
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Visitas
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Acesse a agenda de visitas deste imóvel.
                  </p>
                </div>
                <UButton
                  variant="outline"
                  icon="i-lucide-calendar"
                  label="Abrir visitas"
                  @click="navigateTo('/visits')"
                />
              </div>
            </template>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Use a área de visitas para agendar, alterar status ou registrar
              feedback.
            </p>
          </UCard>
        </template>
      </UTabs>
    </template>

    <template v-else>
      <UAlert color="error" title="Erro" description="Imóvel não encontrado." />
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Building } from "~/types/building";

definePageMeta({ layout: "default", title: "Detalhes do imóvel" });

const route = useRoute();
const id = route.params.id as string;

const { data: building, status } = await useFetch<Building>(
  `/api/buildings/${id}`,
);

const pending = computed(() => status.value === "pending");

const tabs = [
  { label: "Info", value: "info", slot: "info", icon: "i-lucide-info" },
  { label: "Fotos", value: "photos", slot: "photos", icon: "i-lucide-images" },
  {
    label: "Documentos",
    value: "documents",
    slot: "documents",
    icon: "i-lucide-file-text",
  },
  {
    label: "Visitas",
    value: "visits",
    slot: "visits",
    icon: "i-lucide-calendar",
  },
];

const tab = ref("info");

function formatAddress(address: Building["address"]) {
  return `${address.street}, ${address.number} - ${address.neighbourhood}, ${address.city} - ${address.state}`;
}

function formatCurrency(value?: number | null) {
  if (!value && value !== 0) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function statusBadgeClass(status: Building["status"]) {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200";
    case "RENTED":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200";
    case "MAINTENANCE":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
  }
}

function statusLabel(status: Building["status"]): string {
  switch (status) {
    case "AVAILABLE":
      return "Disponível";
    case "RENTED":
      return "Alugado";
    case "MAINTENANCE":
      return "Manutenção";
    case "INACTIVE":
      return "Inativo";
    default:
      return status;
  }
}

function propertyTypeLabel(type: Building["propertyType"]): string {
  switch (type) {
    case "HOUSE":
      return "Casa";
    case "APARTMENT":
      return "Apartamento";
    case "COMMERCIAL":
      return "Comercial";
    case "LAND":
      return "Terreno";
    case "FARM":
      return "Fazenda";
    default:
      return type;
  }
}
</script>
