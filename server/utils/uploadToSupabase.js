// utils/uploadToSupabase.js
import supabase from "./supabaseClient.js";

export const uploadAlertImage = async (buffer, mimeType) => {
  const bucket = process.env.SUPABASE_BUCKET; // Micro-disaster

  const ext = mimeType.split("/")[1]; // jpeg/png/webp
  const filename = `alert-${Date.now()}.${ext}`;

  // Upload
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  // Public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

  return data.publicUrl;
};
