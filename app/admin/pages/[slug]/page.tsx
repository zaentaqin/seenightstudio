import { notFound } from "next/navigation";
import { hasSupabaseTables } from "@/lib/supabase/has-config";
import { localGetPages } from "@/lib/local-store";
import { updatePage } from "@/app/admin/actions/pages";
import { PageEditor } from "@/components/admin/page-editor";

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

      <PageEditor
        slug={page.slug}
        content={page.content}
        action={updatePage.bind(null, slug)}
      />
    </>
  );
}
