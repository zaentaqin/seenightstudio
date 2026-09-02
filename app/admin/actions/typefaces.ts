"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { hasSupabaseTables } from "@/lib/supabase/has-config";
import {
  localCreateTypeface,
  localUpdateTypeface,
  localDeleteTypeface,
} from "@/lib/local-store";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "fonts");
const ALLOWED_EXT = [".otf", ".ttf", ".woff", ".woff2"];
const MAX_FONT_BYTES = 10 * 1024 * 1024;

function sanitizeFilename(name: string): string {
  const ext = ALLOWED_EXT.find((e) => name.toLowerCase().endsWith(e));
  if (!ext) return "";
  const base = name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  return `${base}${ext}`;
}

async function saveFontFileLocal(
  file: File,
  slug: string,
): Promise<string> {
  const filename = sanitizeFilename(file.name);
  if (!filename) throw new Error(`Unsupported file type: ${file.name}`);
  if (file.size > MAX_FONT_BYTES) {
    throw new Error(
      `File too large (${Math.round(file.size / 1024 / 1024)}MB). Max 10MB.`,
    );
  }

  const dir = path.join(UPLOAD_DIR, slug);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buffer);

  return `/uploads/fonts/${slug}/${filename}`;
}

async function removeFontFileLocal(fontPath: string) {
  if (!fontPath.startsWith("/uploads/fonts/")) return;
  const fullPath = path.join(process.cwd(), "public", fontPath);
  if (existsSync(fullPath)) {
    await unlink(fullPath);
  }
}

function fontFileFromForm(formData: FormData): File | null {
  const value = formData.get("fontFile");
  if (value instanceof File && value.size > 0) return value;
  return null;
}

function parseWeightRange(raw: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[\[\]\(\)]/g, "");
  const parts = cleaned.split(",").map((s) => s.trim());
  if (parts.length === 2 && !Number.isNaN(Number(parts[0])) && !Number.isNaN(Number(parts[1]))) {
    return `[${parts[0]},${parts[1]}]`;
  }
  return null;
}

export async function createTypeface(formData: FormData) {
  if (!(await hasSupabaseTables())) {
    const slug = formData.get("slug") as string;
    const tags = (formData.get("tags") as string || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const fontFile = fontFileFromForm(formData);
    const fontPath = fontFile ? await saveFontFileLocal(fontFile, slug) : null;

    await localCreateTypeface({
      slug,
      name: formData.get("name") as string,
      designer: formData.get("designer") as string,
      category: formData.get("category") as string,
      styles: Number(formData.get("styles")),
      price: Number(formData.get("price")),
      year: Number(formData.get("year")),
      tagline: formData.get("tagline") as string,
      description: formData.get("description") as string,
      tags,
      featured: formData.get("featured") === "on",
      font_path: fontPath,
      weight_range: parseWeightRange(formData.get("weight_range") as string),
      default_weight: Number(formData.get("default_weight") || 400),
      has_italic: formData.get("has_italic") === "on",
    });

    revalidatePath("/admin/typefaces");
    revalidatePath("/fonts");
    revalidatePath(`/fonts/${slug}`);
    redirect("/admin/typefaces?saved=typeface");
  }

  const { createClient } = await import("@/lib/supabase/server");
  const { upload } = await import("./upload-helpers");
  const supabase = await createClient();

  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const slug = formData.get("slug") as string;
  const fontFile = fontFileFromForm(formData);
  const fontPath = fontFile ? await upload(supabase, fontFile, slug) : null;

  const { error } = await supabase.from("typefaces").insert({
    slug,
    name: formData.get("name") as string,
    designer: formData.get("designer") as string,
    category: formData.get("category") as string,
    styles: Number(formData.get("styles")),
    price: Number(formData.get("price")),
    year: Number(formData.get("year")),
    tagline: formData.get("tagline") as string,
    description: formData.get("description") as string,
    tags,
    featured: formData.get("featured") === "on",
    font_path: fontPath,
    weight_range: parseWeightRange(formData.get("weight_range") as string),
    default_weight: Number(formData.get("default_weight") || 400),
    has_italic: formData.get("has_italic") === "on",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/typefaces");
  revalidatePath("/fonts");
  revalidatePath(`/fonts/${slug}`);
  redirect("/admin/typefaces?saved=typeface");
}

export async function updateTypeface(slug: string, formData: FormData) {
  if (!(await hasSupabaseTables())) {
    const tags = (formData.get("tags") as string || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const existing = await localGetTypefaceBySlug(slug);
    const oldPath = existing?.font_path ?? null;

    const fontFile = fontFileFromForm(formData);
    const removeFile = formData.get("removeFontFile") === "on";

    let fontPath = oldPath;
    if (fontFile) {
      fontPath = await saveFontFileLocal(fontFile, slug);
      if (oldPath && oldPath !== fontPath) {
        await removeFontFileLocal(oldPath);
      }
    } else if (removeFile) {
      if (oldPath) await removeFontFileLocal(oldPath);
      fontPath = null;
    }

    await localUpdateTypeface(slug, {
      name: formData.get("name") as string,
      designer: formData.get("designer") as string,
      category: formData.get("category") as string,
      styles: Number(formData.get("styles")),
      price: Number(formData.get("price")),
      year: Number(formData.get("year")),
      tagline: formData.get("tagline") as string,
      description: formData.get("description") as string,
      tags,
      featured: formData.get("featured") === "on",
      font_path: fontPath,
      weight_range: parseWeightRange(formData.get("weight_range") as string),
      default_weight: Number(formData.get("default_weight") || 400),
      has_italic: formData.get("has_italic") === "on",
    });

    revalidatePath("/admin/typefaces");
    revalidatePath(`/admin/typefaces/${slug}`);
    revalidatePath("/fonts");
    revalidatePath(`/fonts/${slug}`);
    redirect("/admin/typefaces?saved=typeface");
  }

  const { createClient } = await import("@/lib/supabase/server");
  const { upload, removeFont } = await import("./upload-helpers");
  const supabase = await createClient();

  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const {
    data: current,
    error: fetchError,
  } = await supabase
    .from("typefaces")
    .select("font_path")
    .eq("slug", slug)
    .maybeSingle();
  if (fetchError) throw new Error(fetchError.message);

  const oldPath = current?.font_path ?? null;
  const fontFile = fontFileFromForm(formData);
  const removeFile = formData.get("removeFontFile") === "on";

  let fontPath = oldPath;
  if (fontFile) {
    fontPath = await upload(supabase, fontFile, slug);
    if (oldPath && oldPath !== fontPath) {
      await removeFont(supabase, oldPath);
    }
  } else if (removeFile) {
    fontPath = null;
    if (oldPath) await removeFont(supabase, oldPath);
  }

  const { error } = await supabase
    .from("typefaces")
    .update({
      name: formData.get("name") as string,
      designer: formData.get("designer") as string,
      category: formData.get("category") as string,
      styles: Number(formData.get("styles")),
      price: Number(formData.get("price")),
      year: Number(formData.get("year")),
      tagline: formData.get("tagline") as string,
      description: formData.get("description") as string,
      tags,
      featured: formData.get("featured") === "on",
      font_path: fontPath,
      weight_range: parseWeightRange(formData.get("weight_range") as string),
      default_weight: Number(formData.get("default_weight") || 400),
      has_italic: formData.get("has_italic") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/typefaces");
  revalidatePath(`/admin/typefaces/${slug}`);
  revalidatePath("/fonts");
  revalidatePath(`/fonts/${slug}`);
  redirect("/admin/typefaces?saved=typeface");
}

export async function deleteTypeface(slug: string) {
  if (!(await hasSupabaseTables())) {
    const existing = await localGetTypefaceBySlug(slug);
    if (existing?.font_path) {
      await removeFontFileLocal(existing.font_path);
    }
    await localDeleteTypeface(slug);
    revalidatePath("/admin/typefaces");
    revalidatePath("/fonts");
    revalidatePath(`/fonts/${slug}`);
    redirect("/admin/typefaces?saved=deleted");
  }

  const { createClient } = await import("@/lib/supabase/server");
  const { removeFont } = await import("./upload-helpers");
  const supabase = await createClient();

  const {
    data: current,
    error: fetchError,
  } = await supabase
    .from("typefaces")
    .select("font_path")
    .eq("slug", slug)
    .maybeSingle();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase.from("typefaces").delete().eq("slug", slug);
  if (error) throw new Error(error.message);

  if (current?.font_path) {
    await removeFont(supabase, current.font_path);
  }

  revalidatePath("/admin/typefaces");
  revalidatePath("/fonts");
  revalidatePath(`/fonts/${slug}`);
  redirect("/admin/typefaces?saved=deleted");
}

async function localGetTypefaceBySlug(slug: string) {
  const { localGetTypefaceBySlug: get } = await import("@/lib/local-store");
  return get(slug);
}
