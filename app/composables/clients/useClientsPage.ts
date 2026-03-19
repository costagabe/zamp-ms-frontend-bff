import type { Client } from "~/types/client";

export function useClientsPage() {
  const router = useRouter();
  const store = useClientsStore();

  const showDeleteModal = ref(false);

  async function deleteClient(id: string) {
    store.loading = true;
    try {
      await store.remove(id);
      showDeleteModal.value = false;
    } catch {
      store.error = "Erro ao remover cliente.";
    } finally {
      store.loading = false;
    }
  }

  function openCreate() {
    router.push("/clients/create");
  }

  function openEdit(client: Client) {
    router.push(`/clients/${client.id}`);
  }

  function openDelete(client: Client) {
    store.selectedClient = client;
    showDeleteModal.value = true;
  }

  return {
    store,
    showDeleteModal,
    deleteClient,
    openCreate,
    openEdit,
    openDelete,
  };
}
