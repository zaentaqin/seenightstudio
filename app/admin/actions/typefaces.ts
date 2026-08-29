"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTypeface(formData: FormData) {
  const supabase = await createClient();

  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const { error } = await supabase.from("typefaces").insert({
    slug: formData.get("slug") as string,
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

  const { error } = await supabase
    .from("typefaces")
    .delete()
    .eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/typefaces");
  revalidatePath("/fonts");
  redirect("/admin/typefaces");
}
