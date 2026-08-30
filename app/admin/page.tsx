import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/has-config";
import Link from "next/link";
import { Type, FileText, Settings } from "lucide-react";

export default async function AdminDashboard() {
  if (!hasSupabaseConfig()) {
    return (
      <>
        <h1 className="text-3xl font-bold tracking-tighter uppercase">
          Dashboard
        </h1>
        <div className="mt-8 border border-ink/15 p-8 text-center">
          <p className="font-mono text-sm text-ink/60">
            Supabase is not configured. Add env vars to enable the admin
            dashboard.
          </p>
          <p className="mt-2 font-mono text-[10px] text-ink/40">
            NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
          </p>
        </div>
      </>
    );
  }

  const supabase = await createClient();

  const [typefaces, pages, settings] = await Promise.all([
    supabase.from("typefaces").select("id", { count: "exact", head: true }),
    supabase.from("pages").select("id", { count: "exact", head: true }),
    supabase.from("settings").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Typefaces",
      count: typefaces.count ?? 0,
      href: "/admin/typefaces",
      icon: Type,
    },
    {
      label: "Pages",
      count: pages.count ?? 0,
      href: "/admin/pages",
      icon: FileText,
    },
    {
      label: "Settings",
      count: settings.count ?? 0,
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter uppercase">
        Dashboard
      </h1>
      <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
        Manage your site content
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group border border-ink/15 p-6 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <stat.icon className="h-5 w-5 text-ink/40 group-hover:text-paper/40" />
            <p className="mt-4 text-3xl font-bold">{stat.count}</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase group-hover:text-paper/50">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="font-mono text-[10px] tracking-[0.25em] text-ink/40 uppercase">
          Quick actions
        </h2>
        <div className="mt-4 flex gap-3">
          <Link
            href="/admin/typefaces/new"
            className="border border-ink px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase transition-colors hover:bg-ink hover:text-paper"
          >
            + New typeface
          </Link>
          <Link
            href="/"
            target="_blank"
            className="border border-ink/25 px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase text-ink/60 transition-colors hover:border-ink hover:text-ink"
          >
            View site
          </Link>
        </div>
      </div>
    </>
  );
}
