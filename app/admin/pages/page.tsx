import Link from "next/link";
import { hasSupabaseTables } from "@/lib/supabase/has-config";
import { localGetPages } from "@/lib/local-store";
import { Pencil } from "lucide-react";

export default async function AdminPages() {
  let pages: { id: string; slug: string; updated_at: string }[] = [];

  if (await hasSupabaseTables()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("pages")
      .select("*")
      .order("slug");
    pages = data ?? [];
  } else {
    pages = await localGetPages();
  }

  const pageLabels: Record<string, string> = {
    home: "Home",
    about: "About",
    contact: "Contact",
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tighter uppercase md:text-3xl">
          Pages
        </h1>
        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
          Edit page content
        </p>
      </div>

      {/* Desktop table */}
      <div className="mt-8 hidden border border-ink/15 md:block">
        <div className="grid grid-cols-12 gap-4 border-b border-ink/15 bg-ink/5 px-6 py-3 font-mono text-[9px] tracking-[0.2em] text-ink/50 uppercase">
          <span className="col-span-4">Page</span>
          <span className="col-span-4">Slug</span>
          <span className="col-span-3">Updated</span>
          <span className="col-span-1 text-right">Edit</span>
        </div>

        {pages.map((page) => (
          <div
            key={page.id}
            className="grid grid-cols-12 items-center gap-4 border-b border-ink/10 px-6 py-3 transition-colors last:border-b-0 hover:bg-ink/5"
          >
            <span className="col-span-4 text-sm font-bold">
              {pageLabels[page.slug] ?? page.slug}
            </span>
            <span className="col-span-4 font-mono text-[10px] text-ink/60">
              /{page.slug}
            </span>
            <span className="col-span-3 font-mono text-[10px] text-ink/60">
              {new Date(page.updated_at).toLocaleDateString()}
            </span>
            <div className="col-span-1 flex justify-end">
              <Link
                href={`/admin/pages/${page.slug}`}
                className="p-1.5 text-ink/40 transition-colors hover:text-accent"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {pages.map((page) => (
          <Link
            key={page.id}
            href={`/admin/pages/${page.slug}`}
            className="flex items-center justify-between border border-ink/15 p-4 transition-colors hover:border-ink/30 hover:bg-ink/5"
          >
            <div>
              <p className="text-sm font-bold">
                {pageLabels[page.slug] ?? page.slug}
              </p>
              <p className="mt-1 font-mono text-[10px] text-ink/40">
                /{page.slug}
              </p>
            </div>
            <Pencil className="h-4 w-4 shrink-0 text-ink/30" />
          </Link>
        ))}
      </div>
    </>
  );
}
