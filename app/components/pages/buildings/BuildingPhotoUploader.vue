<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-center gap-3">
      <UButton
        type="button"
        color="primary"
        icon="i-lucide-upload-cloud"
        label="Selecionar imagens"
        @click="openFilePicker"
      />
      <input
        ref="fileInputRef"
        class="sr-only"
        type="file"
        accept="image/*"
        multiple
        @change="onFilesSelected"
      />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Adicione várias imagens, recorte em 1024x1024 e envie para o bucket
        configurado.
      </p>
    </div>

    <div v-if="sources.length" class="flex flex-wrap gap-3">
      <button
        v-for="source in sources"
        :key="source.id"
        type="button"
        class="group flex flex-col gap-1 text-left"
        @click="selectSource(source.id)"
      >
        <div
          class="relative aspect-square w-24 overflow-hidden rounded-md border bg-gray-50 transition ring-primary-500 group-hover:ring-2 dark:border-gray-800 dark:bg-gray-900"
          :class="{
            'ring-2 ring-offset-2 ring-primary-500 ring-offset-white dark:ring-offset-gray-950':
              selectedSourceId === source.id,
          }"
        >
          <img
            :src="source.url"
            :alt="source.name"
            class="h-full w-full object-contain"
          />
        </div>
        <span
          class="line-clamp-2 w-24 text-xs text-gray-600 dark:text-gray-300"
        >
          {{ source.name }}
        </span>
      </button>
    </div>
    <p v-else class="text-sm text-gray-500 dark:text-gray-400">
      Nenhuma imagem selecionada ainda.
    </p>

    <div class="space-y-3">
      <div v-if="activeSource" class="mx-auto w-full max-w-4xl">
        <div
          class="relative h-[clamp(20rem,65vh,36rem)] w-full overflow-hidden rounded-lg border bg-gray-50 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <Cropper
            ref="cropperRef"
            :src="activeSource.url"
            :stencil-props="{ aspectRatio: 1 }"
            :image-restriction="'stencil'"
            :auto-zoom="true"
            :resize-image="true"
            class="h-full w-full"
          />
        </div>
      </div>
      <div
        v-else
        class="flex h-[clamp(20rem,65vh,36rem)] items-center justify-center rounded-lg border border-dashed px-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-300"
      >
        Selecione uma miniatura para habilitar o corte.
      </div>

      <div class="flex flex-wrap items-center justify-end gap-2">
        <UButton
          variant="outline"
          color="neutral"
          icon="i-lucide-rotate-ccw"
          label="Resetar corte"
          :disabled="!activeSource"
          @click="resetCrop"
        />
        <UButton
          color="primary"
          icon="i-lucide-crop"
          :disabled="!activeSource || processing"
          :loading="processing"
          label="Cortar imagem"
          @click="handleCrop"
        />
      </div>
    </div>

    <div v-if="crops.length" class="space-y-2">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
          Cortes prontos
        </h4>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ crops.length }} corte(s)
        </span>
      </div>

      <div
        class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <div
          v-for="crop in crops"
          :key="crop.id"
          class="overflow-hidden rounded-md border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800"
          >
            <img
              :src="crop.previewUrl"
              :alt="crop.filename"
              class="h-full w-full object-cover"
            />
            <div
              v-if="crop.uploading"
              class="absolute inset-0 flex items-center justify-center bg-black/40 text-white"
            >
              <UIcon
                class="size-4 animate-spin"
                name="i-lucide-loader-circle"
              />
            </div>
            <div
              v-else-if="crop.error"
              class="absolute inset-0 flex items-center justify-center bg-red-600/80 px-2 text-center text-xs text-white"
            >
              {{ crop.error }}
            </div>
          </div>
          <div
            class="flex items-center justify-between gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-200"
          >
            <span class="truncate">{{ crop.filename }}</span>
            <UBadge
              v-if="crop.result && !crop.uploading"
              size="xs"
              variant="soft"
              color="success"
              >Salvo</UBadge
            >
          </div>
          <div class="flex justify-end gap-2 px-3 pb-3">
            <UButton
              size="xs"
              variant="ghost"
              color="neutral"
              icon="i-lucide-eye"
              :disabled="!crop.sourceId"
              @click="selectSource(crop.sourceId)"
            />
            <UButton
              size="xs"
              variant="ghost"
              color="error"
              icon="i-lucide-trash"
              @click="removeCrop(crop.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import type { BuildingPhoto, PhotoMetadataPayload } from "~/types/building";

type CropperComponent = InstanceType<typeof Cropper>;

interface UploadResponse {
  bucket: string;
  storagePath: string;
  publicUrl: string;
  contentType: string;
  size: number;
  filename: string;
  extension: string;
}

interface DeleteStorageRequest {
  bucket: string;
  storagePath: string;
}

interface SourceImage {
  id: string;
  file: File;
  url: string;
  name: string;
}

interface CroppedItem {
  id: string;
  sourceId: string;
  previewUrl: string;
  filename: string;
  size: number;
  uploading: boolean;
  error: string | null;
  result?: UploadResponse;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    bucket: string;
    uploadUrl?: string;
    deleteUrl?: string;
    buildingId?: string;
  }>(),
  {
    modelValue: () => [],
    uploadUrl: "/api/storage/upload",
    deleteUrl: "/api/storage/delete",
    buildingId: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [string[]];
  uploaded: [string | BuildingPhoto];
}>();

const toast = useToast();
const buildingsStore = useBuildingsStore();

const fileInputRef = ref<HTMLInputElement | null>(null);
const cropperRef = ref<CropperComponent | null>(null);
const sources = ref<SourceImage[]>([]);
const selectedSourceId = ref<string | null>(null);
const crops = ref<CroppedItem[]>([]);
const processing = ref(false);
const activeSource = computed(
  () =>
    sources.value.find((item) => item.id === selectedSourceId.value) ?? null,
);

watch(
  () => sources.value.length,
  (len) => {
    if (len && !selectedSourceId.value) {
      const firstSource = sources.value[0];
      if (firstSource) selectedSourceId.value = firstSource.id;
    }
  },
);

watch(
  () => props.modelValue,
  (value) => {
    const previous = [...crops.value];
    const mapped = (value ?? [])
      .map((storagePath) => {
        const existing = crops.value.find(
          (crop) => crop.result?.storagePath === storagePath,
        );
        return existing ? { ...existing, uploading: false, error: null } : null;
      })
      .filter(Boolean) as CroppedItem[];

    const uploading = crops.value.filter((crop) => crop.uploading);
    const nextCrops = [...mapped, ...uploading];

    revokeUnusedObjectUrls(previous, nextCrops);
    crops.value = nextCrops;
  },
  { immediate: true, deep: true },
);

function selectSource(id: string) {
  selectedSourceId.value = id;
}

function openFilePicker() {
  fileInputRef.value?.click();
}

function onFilesSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files ? Array.from(target.files) : [];
  if (!files.length) return;

  const next = files
    .filter((file) => file.type.startsWith("image/"))
    .map(
      (file) =>
        ({
          id: crypto.randomUUID(),
          file,
          url: URL.createObjectURL(file),
          name: file.name,
        }) satisfies SourceImage,
    );

  sources.value = [...sources.value, ...next];
  if (!selectedSourceId.value && next.length) {
    const firstAdded = next[0];
    if (firstAdded) selectedSourceId.value = firstAdded.id;
  }

  target.value = "";
}

function resetCrop() {
  cropperRef.value?.reset();
}

async function handleCrop() {
  if (!cropperRef.value || !activeSource.value) return;
  processing.value = true;
  let activeCropItem: CroppedItem | null = null;

  try {
    const existingCrop = crops.value.find(
      (item) => item.sourceId === activeSource.value?.id,
    );
    const previousUpload = existingCrop?.result;

    const result = cropperRef.value.getResult();

    const canvas = result?.canvas;
    if (!canvas) {
      throw new Error("Não foi possível gerar o corte.");
    }

    const normalizedCanvas = normalizeCanvas(canvas, 1024);

    const blob = await new Promise<Blob>((resolve, reject) => {
      normalizedCanvas.toBlob(
        (output) => {
          if (output) return resolve(output);
          reject(new Error("Falha ao converter o corte."));
        },
        "image/jpeg",
        0.92,
      );
    });

    const filename = buildFilename(activeSource.value.name);
    const file = new File([blob], filename, { type: blob.type });
    const previewUrl = URL.createObjectURL(blob);

    const cropItem: CroppedItem = existingCrop ?? {
      id: crypto.randomUUID(),
      sourceId: activeSource.value.id,
      previewUrl,
      filename,
      size: blob.size,
      uploading: true,
      error: null,
    };
    activeCropItem = cropItem;

    if (existingCrop) {
      if (existingCrop.previewUrl !== previewUrl) {
        revokeObjectUrl(existingCrop.previewUrl);
      }
      cropItem.previewUrl = previewUrl;
      cropItem.filename = filename;
      cropItem.size = blob.size;
      cropItem.uploading = true;
      cropItem.error = null;
      cropItem.result = undefined;
    } else {
      crops.value = [cropItem, ...crops.value];
    }

    const uploaded = await uploadFile(file);
    if (previousUpload?.storagePath) {
      await deleteStoredFile(previousUpload.bucket, previousUpload.storagePath);
    }

    const createdPhoto = props.buildingId
      ? await registerPhotoMetadata(uploaded)
      : undefined;

    cropItem.uploading = false;
    cropItem.result = uploaded;

    pushValue(uploaded, createdPhoto, previousUpload?.storagePath);
  } catch (err: any) {
    const message = err?.message || "Erro ao cortar a imagem.";
    toast.add({
      title: "Erro",
      description: message,
      color: "error",
    });
    if (activeCropItem && activeCropItem.uploading) {
      activeCropItem.uploading = false;
      activeCropItem.error = message;
    }
  } finally {
    processing.value = false;
  }
}

async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", props.bucket || "buildings");

  return await $fetch<UploadResponse>(props.uploadUrl, {
    method: "POST",
    body: formData,
  });
}

async function deleteStoredFile(
  bucket: string,
  storagePath: string,
): Promise<void> {
  if (!bucket || !storagePath) return;

  await $fetch(props.deleteUrl, {
    method: "DELETE",
    body: {
      bucket,
      storagePath,
    } satisfies DeleteStorageRequest,
  });
}

function pushValue(
  uploaded: UploadResponse,
  createdPhoto?: BuildingPhoto,
  replacedStoragePath?: string,
) {
  const payload = uploaded.storagePath;
  const current = [...(props.modelValue ?? [])];

  const next = replacedStoragePath
    ? current.includes(replacedStoragePath)
      ? current.map((item) => (item === replacedStoragePath ? payload : item))
      : [...current, payload]
    : [...current, payload];

  const deduped = Array.from(new Set(next));
  emit("update:modelValue", deduped);
  emit("uploaded", createdPhoto ?? payload);
}

async function registerPhotoMetadata(
  uploaded: UploadResponse,
): Promise<BuildingPhoto> {
  if (!props.buildingId) {
    throw new Error("ID do imóvel ausente para registrar metadata da foto.");
  }

  const payload: PhotoMetadataPayload = {
    buildingId: props.buildingId,
    contentType: uploaded.contentType,
    size: uploaded.size,
    publicPath: uploaded.publicUrl,
    storagePath: uploaded.storagePath,
    bucket: uploaded.bucket,
    filename: uploaded.filename,
    extension: uploaded.extension,
  };

  return await buildingsStore.addPhotoMetadata(props.buildingId, payload);
}

function removeCrop(id: string) {
  const crop = crops.value.find((item) => item.id === id);
  crops.value = crops.value.filter((item) => item.id !== id);
  if (crop?.previewUrl) revokeObjectUrl(crop.previewUrl);

  if (crop?.result) {
    const next = (props.modelValue ?? []).filter(
      (item) => item !== crop.result?.storagePath,
    );
    emit("update:modelValue", next);
  }
}

function buildFilename(originalName: string) {
  const base = originalName?.split(".").shift()?.trim() || "imagem";
  return `${base}-${Date.now()}.jpg`;
}

onBeforeUnmount(() => {
  sources.value.forEach((item) => revokeObjectUrl(item.url));
  crops.value.forEach((item) => revokeObjectUrl(item.previewUrl));
});

function revokeObjectUrl(url: string) {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}

function revokeUnusedObjectUrls(previous: CroppedItem[], next: CroppedItem[]) {
  const nextUrls = new Set(next.map((item) => item.previewUrl));
  previous.forEach((item) => {
    if (item.previewUrl && !nextUrls.has(item.previewUrl)) {
      revokeObjectUrl(item.previewUrl);
    }
  });
}

function normalizeCanvas(canvas: HTMLCanvasElement, size: number) {
  if (canvas.width === size && canvas.height === size) return canvas;

  const output = document.createElement("canvas");
  output.width = size;
  output.height = size;

  const context = output.getContext("2d");
  if (!context) return canvas;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(canvas, 0, 0, size, size);
  return output;
}
</script>
