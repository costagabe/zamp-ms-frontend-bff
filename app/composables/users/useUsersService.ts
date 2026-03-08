import type { User, CreateUserPayload, UpdateUserPayload } from "~/types/user";

export function useUsersService() {
  async function fetchAll(): Promise<User[]> {
    return await $fetch<User[]>("/api/users");
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

  return { fetchAll, fetchById, create, update, remove };
}
