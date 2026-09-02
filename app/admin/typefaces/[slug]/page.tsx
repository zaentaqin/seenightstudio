import { notFound } from "next/navigation";
import Link from "next/link";
import { hasSupabaseTables } from "@/lib/supabase/has-config";
import { localGetTypefaceBySlug } from "@/lib/local-store";
import { updateTypeface, deleteTypeface } from "@/app/admin/actions/typefaces";
import { CATEGORIES } from "@/lib/typefaces";

export default async function EditTypefacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let font: Record<string, unknown> | null = null;

  if (await hasSupabaseTables()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("typefaces")
      .select("*")
      .eq("slug", slug)
      .single();
    font = data;
  } else {
    font = (await localGetTypefaceBySlug(slug)) ?? null;
  }

  if (!font) notFound();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter uppercase">
        Edit Typeface
      </h1>
      <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
        {String(font.name)}
      </p>

      <form action={updateTypeface.bind(null, slug)} className="mt-8 max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field name="name" label="Name" defaultValue={String(font.name)} required />
          <Field name="designer" label="Designer" defaultValue={String(font.designer)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
              Category
            </label>
            <select
              name="category"
              required
              defaultValue={String(font.category)}
              className="block w-full border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <Field name="year" label="Year" type="number" defaultValue={Number(font.year)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field name="styles" label="Styles" type="number" defaultValue={Number(font.styles)} required />
          <Field name="price" label="Price (USD)" type="number" defaultValue={Number(font.price)} required />
        </div>

        <Field name="tagline" label="Tagline" defaultValue={String(font.tagline)} required />

        <div>
          <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            required
            defaultValue={String(font.description)}
            className="block w-full resize-none border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
          />
        </div>

        <Field
          name="tags"
          label="Tags (comma-separated)"
          defaultValue={Array.isArray(font.tags) ? (font.tags as string[]).join(", ") : ""}
        />

        <div className="grid grid-cols-3 gap-4">
          <Field
            name="weight_range"
            label="Weight range"
            placeholder="[100,900]"
            defaultValue={String(font.weight_range ?? "")}
          />
          <Field
            name="default_weight"
            label="Default weight"
            type="number"
            defaultValue={Number(font.default_weight ?? 400)}
          />
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="has_italic"
                defaultChecked={Boolean(font.has_italic)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              <span className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                Has italic
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
            Font file (OTF / TTF / WOFF / WOFF2)
          </label>
          <div className="border border-dashed border-ink/25">
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
              <span className="truncate font-mono text-[11px]">
                {font.font_path
                  ? String(font.font_path).split("/").pop()
                  : "No file uploaded"}
              </span>
              {Boolean(font.font_path) && (
                <span className="shrink-0 font-mono text-[9px] text-accent uppercase">
                  live on site
                </span>
              )}
            </div>
            <input
              type="file"
              name="fontFile"
              accept=".otf,.ttf,.woff,.woff2"
              className="block w-full bg-transparent px-4 py-3 text-sm outline-none file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.15em] file:text-paper"
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-mono text-[10px] text-ink/40">
              Pick a file to replace the current one. Max 10MB.
            </p>
            {Boolean(font.font_path) && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="removeFontFile"
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                <span className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                  Remove file
                </span>
              </label>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={Boolean(font.featured)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          <span className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
            Featured
          </span>
        </label>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="border border-ink bg-ink px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase text-paper transition-colors hover:border-accent hover:bg-accent"
          >
            Save changes
          </button>
          <Link
            href="/admin/typefaces"
            className="border border-ink/25 px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase text-ink/60 transition-colors hover:border-ink hover:text-ink"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="mt-16 border-t border-ink/15 pt-8">
        <h2 className="font-mono text-[10px] tracking-[0.25em] text-ink/40 uppercase">
          Danger zone
        </h2>
        <form action={deleteTypeface.bind(null, slug)} className="mt-4">
          <button
            type="submit"
            className="border border-red-500/50 px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase text-red-500 transition-colors hover:bg-red-500 hover:text-paper"
          >
            Delete typeface
          </button>
        </form>
      </div>
    </>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="block w-full border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
      />
    </div>
  );
}
