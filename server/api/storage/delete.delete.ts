import { serverSupabaseServiceRole } from "#supabase/server";

interface DeleteStorageBody {
  bucket?: string;
  storagePath?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<DeleteStorageBody>(event);
  const bucket = (body?.bucket || "buildings").trim();
  const storagePath = (body?.storagePath || "").trim();

  if (!storagePath) {
    throw createError({
      statusCode: 400,
      statusMessage: "Informe o caminho do arquivo no storage.",
    });
  }

  const client = await serverSupabaseServiceRole(event);
  const { error } = await client.storage.from(bucket).remove([storagePath]);

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao remover arquivo do storage: ${error.message}`,
    });
  }

  return {
    bucket,
    storagePath,
    removed: true,
  };
});
