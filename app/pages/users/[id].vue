<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Editar usuário
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Atualize os dados e permissões do usuário.
        </p>
      </div>

      <UButton
        variant="outline"
        color="neutral"
        icon="i-lucide-arrow-left"
        label="Voltar"
        @click="navigateTo('/users')"
      />
    </div>

    <div v-if="loadingUser" class="py-10 text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="mx-auto h-6 w-6 animate-spin text-gray-400"
      />
    </div>

    <UserForm
      ref="formRef"
      v-else
      :loading="saving"
      :initial-values="formValues"
      title="Atualizar usuário"
      description="Mantenha as informações de contato e perfil atualizadas."
      submit-label="Salvar alterações"
      @submit="handleUpdate"
      @cancel="navigateTo('/users')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { CreateUserPayload } from "~/types/user";
import UserForm from "~/components/pages/users/UserForm.vue";

definePageMeta({ layout: "default" });

const route = useRoute();
const store = useUsersStore();
const { setFlash } = useFlashMessage();

const formRef = ref<InstanceType<typeof UserForm>>();
const userId = computed(() => String(route.params.id));
const loadingUser = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);
const formValues = ref<Partial<CreateUserPayload> | null>(null);

async function loadUser() {
  loadingUser.value = true;
  error.value = null;

  try {
    const user = await store.fetchById(userId.value);
    formValues.value = {
      name: user.name,
      email: user.email,
      role: user.roles[0]?.id ?? "",
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível carregar o usuário.";
    error.value = message;
  } finally {
    loadingUser.value = false;
  }
}

async function handleUpdate(payload: CreateUserPayload) {
  saving.value = true;
  error.value = null;

  try {
    await store.update(userId.value, payload);
    setFlash({
      title: "Sucesso",
      description: "Usuário atualizado com sucesso!",
      color: "success",
    });
    await navigateTo("/users");
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível atualizar o usuário.";
    error.value = message;
    formRef.value?.showError(message);
  } finally {
    saving.value = false;
  }
}

onMounted(loadUser);
</script>
