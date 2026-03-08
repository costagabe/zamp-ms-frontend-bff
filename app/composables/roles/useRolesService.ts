import type { Role } from "~/types/role";

export function useRolesService() {
  async function fetchAll(): Promise<Role[]> {
    return await $fetch<Role[]>("/api/roles");
  }

  return { fetchAll };
}
