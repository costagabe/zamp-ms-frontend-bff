<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Fotos do imóvel
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Gerencie as fotos, defina principal e remova metadados.
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

    <BuildingPhotoUploader :building-id="id" @uploaded="onUploaded" />

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Fotos cadastradas
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Clique para definir principal ou remover.
            </p>
          </div>
          <UButton
            v-if="pending"
            variant="ghost"
            color="neutral"
            icon="i-lucide-loader-2"
            label="Carregando"
            :loading="true"
          />
        </div>
      </template>

      <div v-if="photos.length === 0" class="py-8 text-center text-gray-500">
        Nenhuma foto cadastrada ainda.
      </div>

      <div v-else class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="group relative overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-800"
        >
          <img
            :src="photo.publicPath"
            :alt="photo.filename"
            class="h-48 w-full object-cover"
          />
          <div
            class="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 p-2 text-xs text-white"
          >
            <span>{{ photo.filename }}</span>
            <UBadge v-if="photo.isMain" color="primary" size="xs"
              >Principal</UBadge
            >
          </div>
          <div
            class="absolute inset-0 hidden items-center justify-center gap-2 bg-black/40 group-hover:flex"
          >
            <UButton
              size="sm"
              icon="i-lucide-star"
              label="Tornar principal"
              :variant="photo.isMain ? 'solid' : 'soft'"
              @click="() => setMain(photo)"
            />
            <UButton
              size="sm"
              color="error"
              variant="outline"
              icon="i-lucide-trash"
              label="Remover"
              @click="() => removePhoto(photo)"
            />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import BuildingPhotoUploader from "~/components/pages/buildings/BuildingPhotoUploader.vue";
import type { BuildingPhoto } from "~/types/building";

definePageMeta({ layout: "default", title: "Fotos do imóvel" });

const route = useRoute();
const id = route.params.id as string;

const store = useBuildingsStore();
const toast = useToast();

const photos = ref<BuildingPhoto[]>([]);
const pending = ref(false);

onMounted(loadPhotos);

async function loadPhotos() {
  pending.value = true;
  try {
    photos.value = await store.listPhotos(id);
  } catch (err) {
    console.error(err);
    toast.add({
      title: "Erro",
      description: "Não foi possível carregar as fotos.",
      color: "error",
    });
  } finally {
    pending.value = false;
  }
}

function onUploaded(photo: string | BuildingPhoto) {
  if (typeof photo === "string") {
    // Fallback for legacy uploader payload.
    void loadPhotos();
    return;
  }

  photos.value = [photo, ...photos.value];
}

async function setMain(photo: BuildingPhoto) {
  try {
    const updated = await store.setMainPhoto(id, photo.id);
    photos.value = photos.value.map((p) => ({
      ...p,
      isMain: p.id === updated.id,
    }));
  } catch (err) {
    toast.add({
      title: "Erro",
      description: "Não foi possível definir a foto principal.",
      color: "error",
    });
  }
}

async function removePhoto(photo: BuildingPhoto) {
  const confirmed = window.confirm("Confirmar remoção da foto?");
  if (!confirmed) return;
  try {
    await store.removePhoto(id, photo.id);
    photos.value = photos.value.filter((p) => p.id !== photo.id);
  } catch (err) {
    toast.add({
      title: "Erro",
      description: "Não foi possível remover a foto.",
      color: "error",
    });
  }
}
</script>
