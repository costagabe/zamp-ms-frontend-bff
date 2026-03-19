import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from "~/types/client";
import { useClientsService } from "~/composables/clients/useClientsService";

export const useClientsStore = defineStore("clients", () => {
  const service = useClientsService();

  const clients = ref<Client[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedClient = ref<Client | null>(null);

  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      clients.value = await service.fetchAll();
    } catch {
      error.value = "Erro ao carregar clientes.";
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id: string): Promise<Client> {
    return await service.fetchById(id);
  }

  async function create(payload: CreateClientPayload): Promise<Client> {
    const created = await service.create(payload);
    clients.value.unshift(created);
    return created;
  }

  async function update(
    id: string,
    payload: UpdateClientPayload,
  ): Promise<Client> {
    const updated = await service.update(id, payload);
    const index = clients.value.findIndex((c) => c.id === updated.id);
    if (index !== -1) clients.value[index] = updated;
    return updated;
  }

  async function remove(id: string): Promise<void> {
    await service.remove(id);
    clients.value = clients.value.filter((c) => c.id !== id);
  }

  return {
    clients,
    loading,
    error,
    selectedClient,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  };
});
