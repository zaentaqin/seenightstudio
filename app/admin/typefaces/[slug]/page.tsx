import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateTypeface, deleteTypeface } from "@/app/admin/actions/typefaces";
import { CATEGORIES } from "@/lib/typefaces";

export default async function EditTypefacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: font } = await supabase
    .from("typefaces")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!font) notFound();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter uppercase">
        Edit Typeface
      </h1>
      <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
        {font.name}
      </p>

      <form action={updateTypeface.bind(null, slug)} className="mt-8 max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field name="name" label="Name" defaultValue={font.name} required />
          <Field name="designer" label="Designer" defaultValue={font.designer} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
              Category
            </label>
            <select
              name="category"
              required
              defaultValue={font.category}
              className="block w-full border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <Field name="year" label="Year" type="number" defaultValue={font.year} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field name="styles" label="Styles" type="number" defaultValue={font.styles} required />
          <Field name="price" label="Price (USD)" type="number" defaultValue={font.price} required />
        </div>

        <Field name="tagline" label="Tagline" defaultValue={font.tagline} required />

        <div>
          <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            required
            defaultValue={font.description}
            className="block w-full resize-none border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
          />
        </div>

        <Field
          name="tags"
          label="Tags (comma-separated)"
          defaultValue={font.tags?.join(", ") ?? ""}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={font.featured}
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
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
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
        defaultValue={defaultValue}
        required={required}
        className="block w-full border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
      />
    </div>
  );
}
