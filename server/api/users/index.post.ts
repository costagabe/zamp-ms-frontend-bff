import { createSupabaseUser, deleteSupabaseUser } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const supabaseUserId = await createSupabaseUser(event, body.email);

  try {
    return await proxyToGateway(event, "/auth/users", {
      method: "POST",
      body: JSON.stringify({ ...body, supabaseUserId }),
    });
  } catch (err) {
    await deleteSupabaseUser(event, supabaseUserId);
    throw err;
  }
});
