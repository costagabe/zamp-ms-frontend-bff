import type { User } from "~/types/user";

export function useUsersPage() {
  const router = useRouter();
  const store = useUsersStore();

  const showDeleteModal = ref(false);
  const searchQuery = ref("");

  const filteredUsers = computed(() => {
    const query = searchQuery.value.toLowerCase();
    if (!query) return store.users;
    return store.users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query),
    );
  });

  async function deleteUser(id: string) {
    store.loading = true;
    try {
      await store.remove(id);
      showDeleteModal.value = false;
    } catch {
      store.error = "Erro ao remover usuário.";
    } finally {
      store.loading = false;
    }
  }

  function openCreate() {
    router.push("/users/create");
  }

  function openEdit(user: User) {
    router.push(`/users/${user.id}`);
  }

  function openDelete(user: User) {
    store.selectedUser = user;
    showDeleteModal.value = true;
  }

  return {
    store,
    searchQuery,
    filteredUsers,
    showDeleteModal,
    deleteUser,
    openCreate,
    openEdit,
    openDelete,
  };
}
