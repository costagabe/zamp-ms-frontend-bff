import { serverSupabaseServiceRole } from "#supabase/server";

export async function createSupabaseUser(
  event: any,
  email: string,
  password: string = "123456",
): Promise<string> {
  const client = await serverSupabaseServiceRole(event);

  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao criar usuário no Supabase: ${error.message}`,
    });
  }

  return data.user.id;
}

export async function deleteSupabaseUser(
  event: any,
  userId: string,
): Promise<void> {
  const client = await serverSupabaseServiceRole(event);

  const { error } = await client.auth.admin.deleteUser(userId);

  if (error) {
    console.error(
      `Erro ao remover usuário do Supabase (${userId}): ${error.message}`,
    );

    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao remover usuário do Supabase: ${error.message}`,
    });
  }
}
