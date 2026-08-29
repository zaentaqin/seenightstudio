import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Pencil } from "lucide-react";

export default async function AdminPages() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .order("slug");

  const pageLabels: Record<string, string> = {
    home: "Home",
    about: "About",
    contact: "Contact",
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tighter uppercase">Pages</h1>
        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
          Edit page content
        </p>
      </div>

      <div className="mt-8 border border-ink/15">
        <div className="grid grid-cols-12 gap-4 border-b border-ink/15 bg-ink/5 px-4 py-3 font-mono text-[9px] tracking-[0.2em] text-ink/50 uppercase md:px-6">
          <span className="col-span-4">Page</span>
          <span className="col-span-4">Slug</span>
          <span className="col-span-3">Updated</span>
          <span className="col-span-1 text-right">Edit</span>
        </div>

        {pages?.map((page) => (
          <div
            key={page.id}
            className="grid grid-cols-12 items-center gap-4 border-b border-ink/10 px-4 py-3 transition-colors last:border-b-0 hover:bg-ink/5 md:px-6"
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
    </>
  );
}
