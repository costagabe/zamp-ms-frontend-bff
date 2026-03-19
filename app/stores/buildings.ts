import type {
  Building,
  CreateBuildingPayload,
  UpdateBuildingPayload,
  BuildingPhoto,
  PhotoMetadataPayload,
} from "~/types/building";
import { useBuildingsService } from "~/composables/buildings/useBuildingsService";

export const useBuildingsStore = defineStore("buildings", () => {
  const service = useBuildingsService();

  const items = ref<Building[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selected = ref<Building | null>(null);

  async function fetchAll(params?: { page?: number; pageSize?: number }) {
    loading.value = true;
    error.value = null;
    try {
      const data = await service.fetchPaginated({
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
        sort: { field: "", direction: null },
        filters: {},
      });
      items.value = data.content;
    } catch (err) {
      console.error(err);
      error.value = "Erro ao carregar imóveis.";
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id: string): Promise<Building> {
    return await service.fetchById(id);
  }

  async function create(payload: CreateBuildingPayload): Promise<Building> {
    const created = await service.create(payload);
    items.value.unshift(created);
    return created;
  }

  async function update(
    id: string,
    payload: UpdateBuildingPayload,
  ): Promise<Building> {
    const updated = await service.update(id, payload);
    const index = items.value.findIndex((b) => b.id === updated.id);
    if (index !== -1) items.value[index] = updated;
    return updated;
  }

  async function remove(id: string): Promise<void> {
    await service.remove(id);
    items.value = items.value.filter((b) => b.id !== id);
  }

  async function listPhotos(buildingId: string): Promise<BuildingPhoto[]> {
    return await service.listPhotos(buildingId);
  }

  async function addPhotoMetadata(
    buildingId: string,
    payload: PhotoMetadataPayload,
  ): Promise<BuildingPhoto> {
    return await service.addPhotoMetadata(buildingId, payload);
  }

  async function removePhoto(
    buildingId: string,
    photoId: string,
  ): Promise<void> {
    await service.removePhoto(buildingId, photoId);
  }

  async function setMainPhoto(
    buildingId: string,
    photoId: string,
  ): Promise<BuildingPhoto> {
    return await service.setMainPhoto(buildingId, photoId);
  }

  return {
    items,
    loading,
    error,
    selected,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    listPhotos,
    addPhotoMetadata,
    removePhoto,
    setMainPhoto,
  };
});
