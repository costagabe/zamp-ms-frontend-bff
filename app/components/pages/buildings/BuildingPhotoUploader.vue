<template>
  <div class="space-y-4">
    <BuildingPhotoCarousel
      v-if="showCarousel"
      v-model="value"
      :bucket="bucket"
      :delete-url="deleteUrl"
      @add-more="startAdding"
    />

    <div v-else class="space-y-3">
      <BuildingPhotoCropper
        v-model="cropperIds"
        :bucket="bucket"
        :upload-url="uploadUrl"
        :delete-url="deleteUrl"
        :building-id="buildingId"
        @uploaded="handleUploaded"
        @update:modelValue="handleCropperUpdate"
      />
      <div v-if="value.length" class="flex justify-end">
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-images"
          label="Voltar para galeria"
          @click="stopAdding"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import BuildingPhotoCarousel from "./BuildingPhotoCarousel.vue";
import BuildingPhotoCropper from "./BuildingPhotoCropper.vue";
import type { BuildingPhoto } from "~/types/building";

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    bucket?: string;
    uploadUrl?: string;
    deleteUrl?: string;
    buildingId?: string;
  }>(),
  {
    modelValue: () => [],
    bucket: "buildings-images",
    uploadUrl: "/api/storage/upload",
    deleteUrl: "/api/storage/delete",
    buildingId: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [string[]];
  uploaded: [string | BuildingPhoto];
}>();

const value = computed<string[]>({
  get: () => props.modelValue ?? [],
  set: (val) => emit("update:modelValue", val),
});

const adding = ref((props.modelValue?.length ?? 0) === 0);
const cropperIds = ref<string[]>([]);

const showCarousel = computed(
  () => !adding.value && (value.value?.length ?? 0) > 0,
);

watch(
  () => props.modelValue?.length,
  (len) => {
    if (!len || len === 0) {
      adding.value = true;
    }
  },
);

function startAdding() {
  adding.value = true;
  cropperIds.value = [];
}

function stopAdding() {
  adding.value = false;
}

function handleUploaded(payload: string | BuildingPhoto) {
  const storagePath =
    typeof payload === "string" ? payload : payload.storagePath;
  if (!storagePath) return;
  const next = Array.from(new Set([...value.value, storagePath]));
  emit("update:modelValue", next);
  emit("uploaded", payload);
}

function handleCropperUpdate(ids: string[]) {
  const next = Array.from(new Set([...value.value, ...ids]));
  emit("update:modelValue", next);
}

const bucket = computed(() => props.bucket || "buildings-images");
const uploadUrl = computed(() => props.uploadUrl || "/api/storage/upload");
const deleteUrl = computed(() => props.deleteUrl || "/api/storage/delete");
const buildingId = computed(() => props.buildingId);
</script>
