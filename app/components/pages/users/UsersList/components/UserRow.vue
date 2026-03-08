<template>
  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
    <td class="py-3">
      <div class="flex items-center gap-3">
        <UAvatar size="sm" :alt="name" />
        <span class="font-medium text-gray-900 dark:text-white">{{
          name
        }}</span>
      </div>
    </td>
    <td class="py-3 hidden sm:table-cell text-gray-600 dark:text-gray-400">
      {{ email }}
    </td>
    <td class="py-3">
      <UBadge :color="roleColor" variant="subtle" size="sm">
        {{ roleLabel }}
      </UBadge>
    </td>
    <td class="py-3">
      <UBadge
        :color="situation === 'ACTIVE' ? 'success' : 'neutral'"
        variant="subtle"
        size="sm"
      >
        {{ situation === "ACTIVE" ? "Ativo" : "Inativo" }}
      </UBadge>
    </td>
    <td class="py-3 text-right">
      <div class="flex items-center justify-end gap-1">
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-pencil"
          size="xs"
          @click="emit('edit')"
        />
        <UButton
          variant="ghost"
          color="error"
          icon="i-lucide-trash-2"
          size="xs"
          @click="emit('delete')"
        />
      </div>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import type { User } from "~/types/user";
import { useRoles } from "~/composables/roles/useRoles";

const props = defineProps<{
  id: string;
  name: string;
  email: string;
  roles: User["roles"];
  situation: User["situation"];
}>();

const emit = defineEmits<{ edit: []; delete: [] }>();

const { roles: allRoles } = useRoles();

type BadgeColor = "error" | "warning" | "info" | "neutral";

const currentRole = computed(() => {
  if (!props.roles.length) return null;
  const first = props.roles[0]!;
  return allRoles.value.find((r) => r.id === first.id) ?? first;
});

const roleLabel = computed(() => currentRole.value?.name ?? "Desconhecido");

const roleColor = computed((): BadgeColor => {
  if (!currentRole.value) return "neutral";
  // Mapear cores baseado no level ou característicadas da role
  const levelToColor: Record<number, BadgeColor> = {
    0: "error", // Nível 0 = Admin
    1: "warning", // Nível 1 = Manager
    2: "info", // Nível 2 = Viewer
  };
  return levelToColor[currentRole.value.level] ?? "neutral";
});
</script>
