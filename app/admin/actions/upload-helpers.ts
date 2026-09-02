import type { SupabaseClient } from "@supabase/supabase-js";

const FONT_EXTENSIONS = ["otf", "ttf", "woff", "woff2"];
const MAX_FONT_BYTES = 10 * 1024 * 1024;

function sanitizeFontName(name: string): string {
  const ext = FONT_EXTENSIONS.find((e) => name.toLowerCase().endsWith(`.${e}`));
  if (!ext) return "";
  const base = name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  return `${base}.${ext}`;
}

export async function upload(
  supabase: SupabaseClient,
  file: File,
  slug: string,
) {
  const ext = sanitizeFontName(file.name);
  if (!ext) throw new Error(`Unsupported file type: ${file.name}`);
  if (file.size > MAX_FONT_BYTES) {
    throw new Error(
      `File too large (${Math.round(file.size / 1024 / 1024)}MB). Max 10MB.`,
    );
  }

  const path = `${slug}/${ext}`;
  const { error } = await supabase.storage
    .from("font-files")
    .upload(path, file, {
      upsert: true,
      contentType: file.type || "application/octet-stream",
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return path;
}

export async function removeFont(supabase: SupabaseClient, path: string) {
  await supabase.storage.from("font-files").remove([path]);
}
