"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(key: string, formData: FormData) {
  const supabase = await createClient();

  const valueRaw = formData.get("value") as string;
  let value: Record<string, unknown>;

  try {
    value = JSON.parse(valueRaw);
  } catch {
    throw new Error("Invalid JSON value");
  }

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
