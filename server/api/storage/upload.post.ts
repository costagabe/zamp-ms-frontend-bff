import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: "Envie o arquivo via multipart/form-data.",
    });
  }

  const file = formData.find((f) => f.name === "file");
  const bucketField = formData.find((f) => f.name === "bucket");
  const bucket = (bucketField?.data?.toString() || "buildings").trim();

  if (!file || !file.filename || !file.type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Arquivo inválido ou ausente.",
    });
  }

  const client = await serverSupabaseServiceRole(event);
  const extension = file.filename.split(".").pop() || "bin";
  const safeName = crypto.randomUUID();
  const path = `${safeName}.${extension}`;

  const { error } = await client.storage.from(bucket).upload(path, file.data, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao enviar para storage: ${error.message}`,
    });
  }

  const { data: publicUrl } = client.storage.from(bucket).getPublicUrl(path);

  return {
    bucket,
    storagePath: path,
    publicUrl: publicUrl.publicUrl,
    contentType: file.type,
    size: file.data.length,
    filename: file.filename,
    extension,
  };
});
