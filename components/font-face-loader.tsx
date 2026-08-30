"use client";

import { uploadedFamilyName } from "@/lib/product-fonts";
import { getFontFileUrl } from "@/lib/supabase/storage";
import { useUploadedFont } from "@/components/use-uploaded-font";

/** Registers the real uploaded font globally so any element using the family
 * stack `"SN <slug>", var(--font-…)` renders with it once loaded. */
export function FontFaceLoader({
  slug,
  fontPath,
}: {
  slug: string;
  fontPath?: string | null;
}) {
  useUploadedFont(
    fontPath ? uploadedFamilyName(slug) : null,
    fontPath ? getFontFileUrl(fontPath) : null,
  );
  return null;
}