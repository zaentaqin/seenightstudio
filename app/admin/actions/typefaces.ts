"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

function fontFileFromForm(formData: FormData): File | null {
  const value = formData.get("fontFile");
  if (value instanceof File && value.size > 0) return value;
  return null;
}

async function upload(typeface: SupabaseClient, file: File, slug: string) {
  const ext = sanitizeFontName(file.name);
  if (!ext) throw new Error(`Unsupported file type: ${file.name}`);
  if (file.size > MAX_FONT_BYTES) {
    throw new Error(
      `File too large (${Math.round(file.size / 1024 / 1024)}MB). Max 10MB.`,
    );
  }

  const path = `${slug}/${ext}`;
  const { error } = await typeface.storage
    .from("font-files")
    .upload(path, file, {
      upsert: true,
      contentType: file.type || "application/octet-stream",
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return path;
}

async function remove(supabase: SupabaseClient, path: string) {
  await supabase.storage.from("font-files").remove([path]);
}

export async function createTypeface(formData: FormData) {
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
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/typefaces");
  revalidatePath("/fonts");
  redirect("/admin/typefaces");
}

export async function updateTypeface(slug: string, formData: FormData) {
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
      await remove(supabase, oldPath);
    }
  } else if (removeFile) {
    fontPath = null;
    if (oldPath) await remove(supabase, oldPath);
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
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/typefaces");
  revalidatePath(`/admin/typefaces/${slug}`);
  revalidatePath("/fonts");
  revalidatePath(`/fonts/${slug}`);
  redirect("/admin/typefaces");
}

export async function deleteTypeface(slug: string) {
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
    await remove(supabase, current.font_path);
  }

  revalidatePath("/admin/typefaces");
  revalidatePath("/fonts");
  redirect("/admin/typefaces");
}