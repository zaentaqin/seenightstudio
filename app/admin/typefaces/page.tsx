import Link from "next/link";
import { getTypefaces } from "@/lib/data";
import { Plus, Pencil } from "lucide-react";

export default async function AdminTypefaces() {
  const typefaces = await getTypefaces();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase md:text-3xl">
            Typefaces
          </h1>
          <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
            {typefaces.length} typefaces
          </p>
        </div>
        <Link
          href="/admin/typefaces/new"
          className="flex items-center gap-2 border border-ink bg-ink px-3 py-2 text-[10px] font-bold tracking-[0.15em] uppercase text-paper transition-colors hover:border-accent hover:bg-accent md:px-4 md:py-2.5 md:text-xs"
        >
          <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Add typeface
        </Link>
      </div>

      {/* Desktop table */}
      <div className="mt-8 hidden border border-ink/15 md:block">
        <div className="grid grid-cols-12 gap-4 border-b border-ink/15 bg-ink/5 px-6 py-3 font-mono text-[9px] tracking-[0.2em] text-ink/50 uppercase">
          <span className="col-span-3">Name</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-1">Styles</span>
          <span className="col-span-1">Price</span>
          <span className="col-span-2">Designer</span>
          <span className="col-span-1">Year</span>
          <span className="col-span-1">File</span>
          <span className="col-span-1 text-right">Edit</span>
        </div>

        {typefaces.map((font) => (
          <div
            key={font.slug}
            className="grid grid-cols-12 items-center gap-4 border-b border-ink/10 px-6 py-3 transition-colors last:border-b-0 hover:bg-ink/5"
          >
            <span className="col-span-3 truncate text-sm font-bold">
              {font.name}
            </span>
            <span className="col-span-2 font-mono text-[10px] uppercase text-ink/60">
              {font.category}
            </span>
            <span className="col-span-1 font-mono text-[10px] text-ink/60">
              {font.styles}
            </span>
            <span className="col-span-1 font-mono text-[10px] text-accent">
              ${font.price}
            </span>
            <span className="col-span-2 truncate text-[10px] text-ink/60">
              {font.designer}
            </span>
            <span className="col-span-1 font-mono text-[10px] text-ink/60">
              {font.year}
            </span>
            <span className="col-span-1">
              {font.font_path ? (
                <span className="inline-block border border-accent/50 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-accent uppercase">
                  {font.font_path.split(".").pop()}
                </span>
              ) : (
                <span className="font-mono text-[10px] text-ink/30">—</span>
              )}
            </span>
            <div className="col-span-1 flex justify-end">
              <Link
                href={`/admin/typefaces/${font.slug}`}
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
        {typefaces.map((font) => (
          <Link
            key={font.slug}
            href={`/admin/typefaces/${font.slug}`}
            className="block border border-ink/15 p-4 transition-colors hover:border-ink/30 hover:bg-ink/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{font.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase text-ink/50">
                  {font.category} · {font.styles} styles
                </p>
              </div>
              <span className="shrink-0 font-mono text-sm font-bold text-accent">
                ${font.price}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-ink/40">
                  {font.designer}
                </span>
                <span className="font-mono text-[10px] text-ink/30">
                  {font.year}
                </span>
              </div>
              {font.font_path ? (
                <span className="border border-accent/50 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-accent uppercase">
                  {font.font_path.split(".").pop()}
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      {typefaces.length === 0 && (
        <div className="mt-8 px-4 py-12 text-center font-mono text-[10px] text-ink/40 uppercase">
          No typefaces found
        </div>
      )}
    </>
  );
}
