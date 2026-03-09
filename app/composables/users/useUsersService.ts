import type { User, CreateUserPayload, UpdateUserPayload } from "~/types/user";
import type { FetchParams } from "~/types/zamp-data-table";
import type { PageResponse } from "~/types/common";

export function useUsersService() {
  async function fetchAll(): Promise<User[]> {
    return await $fetch<User[]>("/api/users");
  }

  async function fetchPaginated(
    params: FetchParams,
  ): Promise<PageResponse<User>> {
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

    return await $fetch<PageResponse<User>>("/api/users", { query });
  }

  async function fetchById(id: string): Promise<User> {
    return await $fetch<User>(`/api/users/${id}`);
  }

  async function create(payload: CreateUserPayload): Promise<User> {
    return await $fetch<User>("/api/users", {
      method: "POST",
      body: payload,
    });
  }

  async function update(id: string, payload: UpdateUserPayload): Promise<User> {
    return await $fetch<User>(`/api/users/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async function remove(id: string): Promise<void> {
    await $fetch(`/api/users/${id}`, { method: "DELETE" });
  }

  return { fetchAll, fetchPaginated, fetchById, create, update, remove };
}
