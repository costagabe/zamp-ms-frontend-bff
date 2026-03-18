import { serverSupabaseSession } from "#supabase/server";

interface SidebarItem {
  label: string;
  icon: string;
  to: string;
  roles?: string[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/" },
  { label: "Imóveis", icon: "i-lucide-building-2", to: "/buildings" },
  { label: "Clientes", icon: "i-lucide-users", to: "/clients" },
  {
    label: "Usuários",
    icon: "i-lucide-user-check",
    to: "/users",
    roles: ["ADMIN"],
  },
  {
    label: "Empresas",
    icon: "i-lucide-briefcase",
    to: "/companies",
    roles: ["ADMIN"],
  },
  { label: "Contratos", icon: "i-lucide-file-text", to: "/contracts" },
  { label: "Aluguéis", icon: "i-lucide-wallet", to: "/rents" },
  { label: "Financeiro", icon: "i-lucide-bar-chart-3", to: "/financial" },
  { label: "Visitas", icon: "i-lucide-calendar", to: "/visits" },
  { label: "Manutenções", icon: "i-lucide-wrench", to: "/maintenance" },
];

function extractTokenRoles(accessToken?: string): string[] {
  if (!accessToken) return [];

  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return [];

    const payload = JSON.parse(
      Buffer.from(parts[1]!, "base64url").toString("utf8"),
    ) as { app_roles?: unknown };

    if (!Array.isArray(payload.app_roles)) return [];

    return payload.app_roles.filter(
      (role): role is string => typeof role === "string",
    );
  } catch {
    return [];
  }
}

function hasAccess(item: SidebarItem, roles: string[]): boolean {
  if (!item.roles || item.roles.length === 0) return true;
  return item.roles.some((requiredRole) => roles.includes(requiredRole));
}

export default defineEventHandler(async (event) => {
  const session = await serverSupabaseSession(event);
  const roles = extractTokenRoles(session?.access_token);

  const menuItems = SIDEBAR_ITEMS.filter((item) => hasAccess(item, roles)).map(
    ({ roles: _roles, ...item }) => item,
  );

  const showSettings = roles.includes("ADMIN");

  return {
    roles,
    menuItems,
    showSettings,
  };
});
