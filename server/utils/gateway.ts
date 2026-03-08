import { serverSupabaseSession } from "#supabase/server";
import type { NitroFetchOptions } from "nitropack";

const GATEWAY_URL =
  process.env.GATEWAY_URL || "http://localhost:8080/zamp-ms-gateway";

export async function proxyToGateway(
  event: any,
  path: string,
  options: NitroFetchOptions<string> = {},
) {
  const session = await serverSupabaseSession(event);
  const token = session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await $fetch(`${GATEWAY_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });

  return response;
}
