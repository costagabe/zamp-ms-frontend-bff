import type {
  Building,
  BuildingPage,
  CreateBuildingPayload,
  UpdateBuildingPayload,
  BuildingPhoto,
  PhotoMetadataPayload,
} from "~/types/building";
import type { FetchParams } from "~/types/zamp-data-table";
import type { PageResponse } from "~/types/common";

export function useBuildingsService() {
  async function fetchPaginated(
    params: FetchParams,
  ): Promise<PageResponse<Building>> {
    const query: Record<string, string> = {
      page: String(params.page),
      pageSize: String(params.pageSize),
    };

    if (params.sort.field && params.sort.direction) {
      query.sortField = params.sort.field;
      query.sortDir = params.sort.direction;
    }

    for (const [key, value] of Object.entries(params.filters)) {
      if (value) query[`filter_${key}`] = value;
    }

    return await $fetch<BuildingPage>("/api/buildings", { query });
  }

  async function fetchById(id: string): Promise<Building> {
    return await $fetch<Building>(`/api/buildings/${id}`);
  }

  async function create(payload: CreateBuildingPayload): Promise<Building> {
    return await $fetch<Building>("/api/buildings", {
      method: "POST",
      body: payload,
    });
  }

  async function update(
    id: string,
    payload: UpdateBuildingPayload,
  ): Promise<Building> {
    return await $fetch<Building>(`/api/buildings/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async function remove(id: string): Promise<void> {
    await $fetch(`/api/buildings/${id}`, { method: "DELETE" });
  }

  async function listPhotos(buildingId: string): Promise<BuildingPhoto[]> {
    return await $fetch<BuildingPhoto[]>(`/api/buildings/${buildingId}/photos`);
  }

  async function addPhotoMetadata(
    buildingId: string,
    payload: PhotoMetadataPayload,
  ): Promise<BuildingPhoto> {
    return await $fetch<BuildingPhoto>(`/api/buildings/${buildingId}/photos`, {
      method: "POST",
      body: payload,
    });
  }

  async function removePhoto(
    buildingId: string,
    photoId: string,
  ): Promise<void> {
    await $fetch(`/api/buildings/${buildingId}/photos/${photoId}`, {
      method: "DELETE",
    });
  }

  async function setMainPhoto(
    buildingId: string,
    photoId: string,
  ): Promise<BuildingPhoto> {
    return await $fetch<BuildingPhoto>(
      `/api/buildings/${buildingId}/photos/${photoId}/main`,
      {
        method: "PUT",
      },
    );
  }

  async function fetchDocuments(buildingId: string) {
    return await $fetch(`/api/buildings/${buildingId}/documents`);
  }

  return {
    fetchPaginated,
    fetchById,
    create,
    update,
    remove,
    listPhotos,
    addPhotoMetadata,
    removePhoto,
    setMainPhoto,
    fetchDocuments,
  };
}
