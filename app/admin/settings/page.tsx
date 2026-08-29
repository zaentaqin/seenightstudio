import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "@/app/admin/actions/settings";

export default async function AdminSettings() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .order("key");

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter uppercase">Settings</h1>
      <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
        Site-wide configuration
      </p>

      <div className="mt-8 space-y-8">
        {settings?.map((setting) => (
          <form
            key={setting.id}
            action={updateSettings.bind(null, setting.key)}
            className="border border-ink/15 p-6"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold tracking-tight uppercase">
                {setting.key}
              </h2>
              <span className="font-mono text-[9px] text-ink/30">
                Updated {new Date(setting.updated_at).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                Value (JSON)
              </label>
              <textarea
                name="value"
                rows={12}
                required
                defaultValue={JSON.stringify(setting.value, null, 2)}
                className="block w-full resize-y border border-ink/25 bg-transparent px-4 py-3 font-mono text-xs leading-relaxed outline-none transition-colors focus:border-ink"
                spellCheck={false}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="border border-ink bg-ink px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase text-paper transition-colors hover:border-accent hover:bg-accent"
              >
                Save
              </button>
            </div>
          </form>
        ))}
      </div>
    </>
  );
}
