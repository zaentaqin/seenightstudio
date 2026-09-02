import { createClient } from "@/lib/supabase/server";

let _supabaseAvailable: boolean | null = null;

export async function hasSupabaseTables(): Promise<boolean> {
  if (_supabaseAvailable !== null) return _supabaseAvailable;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    _supabaseAvailable = false;
    return false;
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("typefaces").select("id").limit(1);
    _supabaseAvailable = !error;
    return !error;
  } catch {
    _supabaseAvailable = false;
    return false;
  }
}
