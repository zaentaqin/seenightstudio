"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updatePage(slug: string, formData: FormData) {
  const supabase = await createClient();

  const contentRaw = formData.get("content") as string;
  let content: Record<string, unknown>;

  try {
    content = JSON.parse(contentRaw);
  } catch {
    throw new Error("Invalid JSON content");
  }

  const { error } = await supabase
    .from("pages")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${slug}`);
  revalidatePath(`/${slug}`);
  redirect("/admin/pages");
}
