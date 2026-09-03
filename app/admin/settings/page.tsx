import { hasSupabaseTables } from "@/lib/supabase/has-config";
import { localGetSettings } from "@/lib/local-store";
import { updateSettings } from "@/app/admin/actions/settings";
import { SettingsEditor } from "@/components/admin/settings-editor";

type LocalSetting = {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};

export default async function AdminSettings() {
  let settings: LocalSetting[] = [];

  if (await hasSupabaseTables()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("*")
      .order("key");
    settings = data ?? [];
  } else {
    const keys = ["footer", "nav"];
    for (const key of keys) {
      const value = await localGetSettings(key);
      if (value) {
        settings.push({
          id: key,
          key,
          value,
          updated_at: new Date().toISOString(),
        });
      }
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter uppercase">Settings</h1>
      <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
        Site-wide configuration
      </p>

      <div className="mt-8 space-y-12">
        {settings.map((setting) => (
          <section key={setting.id} className="border border-ink/15 p-6">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="text-lg font-bold tracking-tight uppercase">
                {setting.key}
              </h2>
              <span className="font-mono text-[9px] text-ink/30">
                Updated {new Date(setting.updated_at).toLocaleDateString()}
              </span>
            </div>

            <SettingsEditor
              settingKey={setting.key}
              value={setting.value}
              action={updateSettings.bind(null, setting.key)}
            />
          </section>
        ))}
      </div>
    </>
  );
}
