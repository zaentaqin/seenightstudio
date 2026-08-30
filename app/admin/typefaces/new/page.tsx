import Link from "next/link";
import { createTypeface } from "@/app/admin/actions/typefaces";
import { CATEGORIES } from "@/lib/typefaces";

export default function NewTypefacePage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter uppercase">
        New Typeface
      </h1>
      <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
        Add a new typeface to the catalog
      </p>

      <form action={createTypeface} className="mt-8 max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field name="slug" label="Slug" placeholder="nocturne-grotesk" required />
          <Field name="name" label="Name" placeholder="Nocturne Grotesk" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field name="designer" label="Designer" placeholder="See Night Studio" required />
          <div>
            <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
              Category
            </label>
            <select
              name="category"
              required
              className="block w-full border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field name="styles" label="Styles" type="number" placeholder="18" required />
          <Field name="price" label="Price (USD)" type="number" placeholder="120" required />
          <Field name="year" label="Year" type="number" placeholder="2025" required />
        </div>

        <Field name="tagline" label="Tagline" placeholder="A workhorse sans for the dark hours." required />

        <div>
          <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            required
            className="block w-full resize-none border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
          />
        </div>

        <Field
          name="tags"
          label="Tags (comma-separated)"
          placeholder="variable, grotesk, ui, branding"
        />

        <div>
          <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
            Font file (OTF / TTF / WOFF / WOFF2)
          </label>
          <input
            type="file"
            name="fontFile"
            accept=".otf,.ttf,.woff,.woff2"
            className="block w-full border border-dashed border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.15em] file:text-paper hover:border-ink focus:border-ink"
          />
          <p className="mt-1.5 font-mono text-[10px] text-ink/40">
            Used for the live specimen on the public font page. Max 10MB.
          </p>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
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
            Create typeface
          </button>
          <Link
            href="/admin/typefaces"
            className="border border-ink/25 px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase text-ink/60 transition-colors hover:border-ink hover:text-ink"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
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
        required={required}
        className="block w-full border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
      />
    </div>
  );
}
