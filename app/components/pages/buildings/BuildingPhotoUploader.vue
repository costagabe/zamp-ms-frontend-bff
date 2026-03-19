<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <UButton
        icon="i-lucide-upload"
        label="Selecionar foto"
        :loading="uploading"
        @click="() => fileInput?.click()"
      />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Corte 1:1 até 1024px antes de enviar. Formatos aceitos: JPG, PNG.
      </p>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />

    <div v-if="selectedImage" class="grid gap-4 md:grid-cols-3">
      <div class="md:col-span-2">
        <div
          class="aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <img
            ref="imageRef"
            :src="selectedImage"
            alt="Selecionada"
            class="max-h-120 w-full object-contain"
          />
        </div>
      </div>
      <div class="space-y-3">
        <div
          class="p-3 rounded-lg border border-gray-200 bg-gray-50 text-sm dark:border-gray-800 dark:bg-gray-900/40"
        >
          <p class="font-medium text-gray-900 dark:text-white">Dicas</p>
          <ul class="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
            <li>• Mantenha o enquadramento 1:1.</li>
            <li>• Ajuste zoom e posição antes de enviar.</li>
            <li>• A imagem será comprimida para 1024px.</li>
          </ul>
        </div>

        <div class="flex flex-col gap-3">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-rotate-ccw"
            label="Reiniciar corte"
            @click="resetCropper"
          />
          <UButton
            icon="i-lucide-check"
            label="Cortar e enviar"
            :loading="uploading"
            :disabled="!cropper"
            @click="cropAndUpload"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, shallowRef } from "vue";
// @ts-expect-error module types shimmed in types/shims-cropperjs.d.ts
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { nanoid } from "nanoid";
import { useBuildingsService } from "~/composables/buildings/useBuildingsService";
import type { BuildingPhoto } from "~/types/building";

const props = withDefaults(
  defineProps<{
    buildingId: string;
    bucket?: string;
  }>(),
  { bucket: "buildings" },
);

const emit = defineEmits<{
  uploaded: [photo: BuildingPhoto];
}>();

const service = useBuildingsService();
const toast = useToast();

const fileInput = ref<HTMLInputElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const cropper = shallowRef<Cropper | null>(null);

const selectedImage = ref<string | null>(null);
const uploading = ref(false);

function destroyCropper() {
  cropper.value?.destroy();
  cropper.value = null;
}

function resetCropper() {
  destroyCropper();
  if (imageRef.value) {
    cropper.value = new Cropper(imageRef.value, {
      aspectRatio: 1,
      viewMode: 1,
      autoCropArea: 1,
      dragMode: "move",
      background: false,
      responsive: true,
    });
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.add({
      title: "Arquivo inválido",
      description: "Escolha uma imagem (JPG ou PNG).",
      color: "error",
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    selectedImage.value = reader.result as string;
    nextTick(() => resetCropper());
  };
  reader.readAsDataURL(file);
}

async function cropAndUpload() {
  if (!cropper.value) return;
  uploading.value = true;
  try {
    const canvas = cropper.value.getCroppedCanvas({
      width: 1024,
      height: 1024,
      maxWidth: 1024,
      maxHeight: 1024,
      fillColor: "#fff",
    });

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b: Blob | null) => resolve(b), "image/jpeg", 0.82),
    );
    if (!blob) throw new Error("Não foi possível gerar a imagem.");

    const filename = `${nanoid()}.jpg`;
    const formData = new FormData();
    formData.append("file", new File([blob], filename, { type: blob.type }));
    formData.append("bucket", props.bucket);

    const uploadResponse = await $fetch<{
      publicUrl: string;
      storagePath: string;
      bucket: string;
      contentType: string;
      size: number;
      filename: string;
      extension: string;
    }>("/api/storage/upload", {
      method: "POST",
      body: formData,
    });

    const photo = await service.addPhotoMetadata(props.buildingId, {
      buildingId: props.buildingId,
      bucket: uploadResponse.bucket,
      contentType: uploadResponse.contentType,
      size: uploadResponse.size,
      publicPath: uploadResponse.publicUrl,
      storagePath: uploadResponse.storagePath,
      filename: uploadResponse.filename,
      extension: uploadResponse.extension,
      orderIndex: 0,
      isMain: false,
    });

    emit("uploaded", photo);
    toast.add({
      title: "Foto enviada",
      description: "A foto foi processada e salva.",
      color: "success",
    });
    selectedImage.value = null;
    destroyCropper();
    fileInput.value && (fileInput.value.value = "");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Não foi possível enviar a foto.";
    toast.add({ title: "Erro", description: message, color: "error" });
  } finally {
    uploading.value = false;
  }
}

defineExpose({ resetCropper });
</script>
