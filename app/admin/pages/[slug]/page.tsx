import { notFound } from "next/navigation";
import Link from "next/link";
import { hasSupabaseTables } from "@/lib/supabase/has-config";
import { localGetPages } from "@/lib/local-store";
import { updatePage } from "@/app/admin/actions/pages";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let page: { slug: string; content: Record<string, unknown> } | null = null;

  if (await hasSupabaseTables()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();
    page = data;
  } else {
    const pages = await localGetPages();
    page = pages.find((p) => p.slug === slug) ?? null;
  }

  if (!page) notFound();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter uppercase">
        Edit Page
      </h1>
      <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
        /{page.slug}
      </p>

      <form action={updatePage.bind(null, slug)} className="mt-8 max-w-3xl space-y-6">
        <div>
          <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
            Content (JSON)
          </label>
          <textarea
            name="content"
            rows={20}
            required
            defaultValue={JSON.stringify(page.content, null, 2)}
            className="block w-full resize-y border border-ink/25 bg-transparent px-4 py-3 font-mono text-xs leading-relaxed outline-none transition-colors focus:border-ink"
            spellCheck={false}
          />
          <p className="mt-2 font-mono text-[9px] text-ink/30 uppercase">
            Edit the JSON content above. Be careful with syntax.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="border border-ink bg-ink px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase text-paper transition-colors hover:border-accent hover:bg-accent"
          >
            Save changes
          </button>
          <Link
            href="/admin/pages"
            className="border border-ink/25 px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase text-ink/60 transition-colors hover:border-ink hover:text-ink"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
