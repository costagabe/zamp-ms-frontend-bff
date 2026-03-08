import { useRolesService } from "~/composables/roles/useRolesService";
import type { Role } from "~/types/role";

export const useRoles = () => {
  const rolesService = useRolesService();

  const roles = ref<Role[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchRoles = async () => {
    loading.value = true;
    error.value = null;

    try {
      roles.value = await rolesService.fetchAll();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Erro ao carregar papéis";
      console.error("Erro ao buscar roles:", err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchRoles();
  });

  return {
    roles: readonly(roles),
    loading: readonly(loading),
    error: readonly(error),
    fetchRoles,
  };
};
