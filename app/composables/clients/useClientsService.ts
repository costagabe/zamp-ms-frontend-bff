import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from "~/types/client";
import type { FetchParams } from "~/types/zamp-data-table";
import type { PageResponse } from "~/types/common";

export function useClientsService() {
  async function fetchAll(): Promise<Client[]> {
    return await $fetch<Client[]>("/api/clients");
  }

  async function fetchPaginated(
    params: FetchParams,
  ): Promise<PageResponse<Client>> {
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

    return await $fetch<PageResponse<Client>>("/api/clients", { query });
  }

  async function fetchById(id: string): Promise<Client> {
    return await $fetch<Client>(`/api/clients/${id}`);
  }

  async function create(payload: CreateClientPayload): Promise<Client> {
    return await $fetch<Client>("/api/clients", {
      method: "POST",
      body: payload,
    });
  }

  async function update(
    id: string,
    payload: UpdateClientPayload,
  ): Promise<Client> {
    return await $fetch<Client>(`/api/clients/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async function remove(id: string): Promise<void> {
    await $fetch(`/api/clients/${id}`, { method: "DELETE" });
  }

  return { fetchAll, fetchPaginated, fetchById, create, update, remove };
}
