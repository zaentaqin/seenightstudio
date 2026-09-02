"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseTables } from "@/lib/supabase/has-config";
import { localUpdatePage } from "@/lib/local-store";

export async function updatePage(slug: string, formData: FormData) {
  const contentRaw = formData.get("content") as string;
  let content: Record<string, unknown>;

  try {
    content = JSON.parse(contentRaw);
  } catch {
    throw new Error("Invalid JSON content");
  }

  if (!(await hasSupabaseTables())) {
    await localUpdatePage(slug, content);
    revalidatePath("/admin/pages");
    revalidatePath(`/admin/pages/${slug}`);
    revalidatePath(`/${slug}`);
    redirect("/admin/pages");
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

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
