import type { User, CreateUserPayload, UpdateUserPayload } from "~/types/user";
import { useUsersService } from "~/composables/users/useUsersService";

export const useUsersStore = defineStore("users", () => {
  const service = useUsersService();

  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedUser = ref<User | null>(null);

  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      users.value = await service.fetchAll();
    } catch {
      error.value = "Erro ao carregar usuários.";
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id: string): Promise<User> {
    return await service.fetchById(id);
  }

  async function create(payload: CreateUserPayload): Promise<User> {
    const created = await service.create(payload);
    users.value.unshift(created);
    return created;
  }

  async function update(id: string, payload: UpdateUserPayload): Promise<User> {
    const updated = await service.update(id, payload);
    const index = users.value.findIndex((u) => u.id === updated.id);
    if (index !== -1) users.value[index] = updated;
    return updated;
  }

  async function remove(id: string): Promise<void> {
    await service.remove(id);
    users.value = users.value.filter((u) => u.id !== id);
  }

  return {
    users,
    loading,
    error,
    selectedUser,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  };
});
