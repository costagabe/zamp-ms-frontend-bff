<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
          Imagens existentes
        </h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Navegue, remova ou adicione novas fotos.
        </p>
      </div>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        label="Adicionar imagens"
        @click="emit('add-more')"
      />
    </div>

    <div v-if="items.length" class="space-y-3">
      <Carousel :items-to-show="1" :wrap-around="true">
        <Slide v-for="item in items" :key="item.storagePath">
          <div
            class="relative overflow-hidden rounded-lg border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <img
              :src="item.publicUrl"
              :alt="item.storagePath"
              class="h-80 w-full object-contain bg-gray-50 dark:bg-gray-800"
            />
            <div
              class="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-3 py-2 text-xs text-white"
            >
              <span class="truncate" :title="item.storagePath">
                {{ item.storagePath }}
              </span>
              <UButton
                size="xs"
                color="error"
                variant="soft"
                icon="i-lucide-trash"
                label="Remover"
                @click="confirmRemoval(item)"
              />
            </div>
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
    <p v-else class="text-sm text-gray-500 dark:text-gray-400">
      Nenhuma imagem cadastrada.
    </p>

    <UModal v-model="showConfirm">
      <UCard>
        <template #header>
          <div class="space-y-1">
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              Remover imagem?
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Esta ação apagará o arquivo do storage e removerá dos campos.
            </p>
          </div>
        </template>

        <div class="space-y-3 text-sm text-gray-700 dark:text-gray-200">
          <p v-if="target">{{ target.storagePath }}</p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="ghost"
              color="neutral"
              label="Cancelar"
              @click="closeModal"
            />
            <UButton
              color="error"
              :loading="deleting"
              label="Remover"
              icon="i-lucide-trash"
              @click="removeTarget"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

interface GalleryItem {
  storagePath: string;
  publicUrl: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    bucket?: string;
    deleteUrl?: string;
  }>(),
  {
    modelValue: () => [],
    bucket: "buildings-images",
    deleteUrl: "/api/storage/delete",
  },
);

const emit = defineEmits<{
  "update:modelValue": [string[]];
  "add-more": [];
}>();

const supabase = useSupabaseClient();
const toast = useToast();
const items = ref<GalleryItem[]>([]);
const showConfirm = ref(false);
const target = ref<GalleryItem | null>(null);
const deleting = ref(false);

watch(
  () => props.modelValue,
  () => void resolvePublicUrls(),
  { immediate: true, deep: true },
);

onMounted(() => {
  void resolvePublicUrls();
});

function closeModal() {
  showConfirm.value = false;
  target.value = null;
}

function confirmRemoval(item: GalleryItem) {
  target.value = item;
  showConfirm.value = true;
}

async function resolvePublicUrls() {
  if (!import.meta.client) return;
  if (!props.modelValue?.length) {
    items.value = [];
    return;
  }

  const next: GalleryItem[] = [];
  for (const storagePath of props.modelValue) {
    const { data } = supabase.storage
      .from(props.bucket)
      .getPublicUrl(storagePath);
    if (data?.publicUrl) {
      next.push({ storagePath, publicUrl: data.publicUrl });
    }
  }
  items.value = next;
}

async function removeTarget() {
  if (!target.value) return;
  deleting.value = true;
  try {
    await $fetch(props.deleteUrl, {
      method: "DELETE",
      body: {
        bucket: props.bucket,
        storagePath: target.value.storagePath,
      },
    });
    const next = (props.modelValue ?? []).filter(
      (item) => item !== target.value?.storagePath,
    );
    emit("update:modelValue", next);
    await resolvePublicUrls();
    toast.add({
      title: "Removido",
      description: "A imagem foi apagada.",
      color: "success",
    });
  } catch (err: any) {
    toast.add({
      title: "Erro",
      description: err?.message || "Não foi possível remover a imagem.",
      color: "error",
    });
  } finally {
    deleting.value = false;
    closeModal();
  }
}
</script>
