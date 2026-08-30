export const FONT_FILES_BUCKET = "font-files";

export function getFontFileUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${FONT_FILES_BUCKET}/${path}`;
}

export function getFontFileUrlOrNull(
  fontPath?: string | null,
): string | null {
  if (!fontPath) return null;
  return getFontFileUrl(fontPath);
}