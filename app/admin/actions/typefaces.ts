"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseTables } from "@/lib/supabase/has-config";
import {
  localCreateTypeface,
  localUpdateTypeface,
  localDeleteTypeface,
} from "@/lib/local-store";

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
      font_path: null,
      weight_range: parseWeightRange(formData.get("weight_range") as string),
      default_weight: Number(formData.get("default_weight") || 400),
      has_italic: formData.get("has_italic") === "on",
    });

    revalidatePath("/admin/typefaces");
    revalidatePath("/fonts");
    redirect("/admin/typefaces");
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
  redirect("/admin/typefaces");
}

export async function updateTypeface(slug: string, formData: FormData) {
  if (!(await hasSupabaseTables())) {
    const tags = (formData.get("tags") as string || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

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
      weight_range: parseWeightRange(formData.get("weight_range") as string),
      default_weight: Number(formData.get("default_weight") || 400),
      has_italic: formData.get("has_italic") === "on",
    });

    revalidatePath("/admin/typefaces");
    revalidatePath(`/admin/typefaces/${slug}`);
    revalidatePath("/fonts");
    revalidatePath(`/fonts/${slug}`);
    redirect("/admin/typefaces");
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
  redirect("/admin/typefaces");
}

export async function deleteTypeface(slug: string) {
  if (!(await hasSupabaseTables())) {
    await localDeleteTypeface(slug);
    revalidatePath("/admin/typefaces");
    revalidatePath("/fonts");
    redirect("/admin/typefaces");
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
  redirect("/admin/typefaces");
}
