<template>
  <UModal
    v-model:open="model"
    :prevent-close="true"
    title="Confirmar exclusão"
    description="Confirmar exclusão do usuário"
  >
    <template #content>
      <LazyUCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Confirmar exclusão
          </h3>
        </template>

        <p class="text-sm text-gray-600 dark:text-gray-400">
          Tem certeza que deseja excluir o usuário
          <strong class="text-gray-900 dark:text-white">{{ user?.name }}</strong
          >? Esta ação não pode ser desfeita.
        </p>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              variant="outline"
              color="neutral"
              label="Cancelar"
              @click="model = false"
            />
            <UButton
              color="error"
              :loading="loading"
              label="Excluir"
              @click="emit('confirm')"
            />
          </div>
        </template>
      </LazyUCard>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { User } from "~/types/user";

defineProps<{
  user: User | null;
  loading: boolean;
}>();

const emit = defineEmits<{ confirm: [] }>();

const model = defineModel<boolean>({ required: true });
</script>
