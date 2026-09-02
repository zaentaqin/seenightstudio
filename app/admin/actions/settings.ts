"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseTables } from "@/lib/supabase/has-config";
import { localUpdateSetting } from "@/lib/local-store";

export async function updateSettings(key: string, formData: FormData) {
  const valueRaw = formData.get("value") as string;
  let value: Record<string, unknown>;

  try {
    value = JSON.parse(valueRaw);
  } catch {
    throw new Error("Invalid JSON value");
  }

  if (!(await hasSupabaseTables())) {
    await localUpdateSetting(key, value);
    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    redirect("/admin/settings");
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase
    .from("settings")
    .update({
      value,
      updated_at: new Date().toISOString(),
    })
    .eq("key", key);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  redirect("/admin/settings");
}
