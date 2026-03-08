import type { User } from "~/types/user";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedUser = ref<User | null>(null);

  function setUsers(data: User[]) {
    users.value = data;
  }

  function addUser(user: User) {
    users.value.unshift(user);
  }

  function updateUser(updated: User) {
    const index = users.value.findIndex((u) => u.id === updated.id);
    if (index !== -1) users.value[index] = updated;
  }

  function removeUser(id: string) {
    users.value = users.value.filter((u) => u.id !== id);
  }

  return {
    users,
    loading,
    error,
    selectedUser,
    setUsers,
    addUser,
    updateUser,
    removeUser,
  };
});
