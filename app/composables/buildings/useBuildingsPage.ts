import type { Building } from "~/types/building";

export function useBuildingsPage() {
  const router = useRouter();
  const store = useBuildingsStore();

  function openCreate() {
    router.push("/buildings/create");
  }

  function openEdit(building: Building) {
    router.push(`/buildings/${building.id}/edit`);
  }

  function openDetails(building: Building) {
    router.push(`/buildings/${building.id}`);
  }

  return {
    store,
    openCreate,
    openEdit,
    openDetails,
  };
}
