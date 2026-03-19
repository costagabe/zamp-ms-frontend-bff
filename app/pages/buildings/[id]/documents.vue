<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Documentos do imóvel
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Visualize ou baixe os documentos associados.
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

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Documentos
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Lista retornada pelo backend.
            </p>
          </div>
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-refresh-cw"
            :loading="pending"
            @click="loadDocuments"
          />
        </div>
      </template>

      <div v-if="pending" class="py-10 text-center">
        <UIcon
          name="i-lucide-loader-2"
          class="mx-auto h-6 w-6 animate-spin text-gray-400"
        />
      </div>

      <div
        v-else-if="documents.length === 0"
        class="py-8 text-center text-gray-500"
      >
        Nenhum documento cadastrado.
      </div>

      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-800">
        <li
          v-for="doc in documents"
          :key="doc.id"
          class="flex items-center justify-between py-3"
        >
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ doc.name || doc.filename || doc.id }}
            </p>
            <p class="text-xs text-gray-500">
              {{ doc.createdAt ? formatDate(doc.createdAt) : "" }}
            </p>
          </div>
          <UButton
            variant="outline"
            icon="i-lucide-download"
            :to="doc.url || doc.downloadUrl || '#'"
            target="_blank"
            label="Baixar"
          />
        </li>
      </ul>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { useBuildingsService } from "~/composables/buildings/useBuildingsService";

definePageMeta({ layout: "default", title: "Documentos do imóvel" });

const route = useRoute();
const id = route.params.id as string;

const service = useBuildingsService();
const toast = useToast();

const documents = ref<any[]>([]);
const pending = ref(false);

onMounted(loadDocuments);

async function loadDocuments() {
  pending.value = true;
  try {
    const result = await service.fetchDocuments(id);
    documents.value = Array.isArray(result) ? result : (result?.content ?? []);
  } catch (err) {
    toast.add({
      title: "Erro",
      description: "Não foi possível carregar os documentos.",
      color: "error",
    });
  } finally {
    pending.value = false;
  }
}

function formatDate(value: string) {
  const d = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}
</script>
